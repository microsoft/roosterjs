var path = require('path');
var glob = require('glob');
var fs = require('fs');
var toposort = require('toposort');
var assign = require('object-assign');

function getDependencies(packageBasePath, packageName) {
	var allPackages = getAllPackages(packageBasePath);

	var packagePath = allPackages[packageName];
	var packageJson = JSON.parse(fs.readFileSync(path.resolve(packagePath, "package.json")).toString());
	var depsMap = {};

	if ('dependencies' in packageJson) {
		assign(depsMap, packageJson.dependencies);
	}

	if ('devDependencies' in packageJson) {
		assign(depsMap, packageJson.devDependencies);
	}

	var deps = Object.keys(depsMap).filter(d => allPackages[d]);
	return deps;
}

function getAllTopologicallySortedPackageNames(packageBasePath) {
	var allPackages = getAllPackages(packageBasePath);
	var graph = [];

	Object.keys(allPackages).forEach(pkgName => {
		var deps = getDependencies(packageBasePath, pkgName);
		deps.forEach(child => {
			graph.push([child, pkgName]);
		});

		if (deps.length == 0) {
			graph.push([pkgName]);
		}
	});

	return toposort(graph).filter(n => n);
}

function getPackageDependencies(packageBasePath, rootPackageNames, depth) {
	var graph = [];
	var stack = [];

	rootPackageNames.forEach(p => stack.push([p, 0]));

	while (stack.length > 0) {
		var item = stack.pop();

		var packageName = item[0];
		var level = item[1];

		if (level < depth || depth == 0) {
			var deps = getDependencies(packageBasePath, packageName);

			deps.forEach(child => {
				graph.push([child, packageName]);
				stack.push([child, level + 1]);
			});

			if (deps.length == 0) {
				graph.push([packageName]);
			}
		}
	}

	return toposort(graph).filter(n => n);
}

/**
 * Gets all the packages in the application, and caches this for quick lookups for subquent calls
 * NOTE: If this will be turned to REPL, we need to add cache invalidation
 */
function getAllPackages(packageBasePath) {
	var packageJsonPaths = glob.sync(path.relative(process.cwd(), path.join(packageBasePath, "**", "package.json")), { nocase: true });
	var allPackages = {};

	packageJsonPaths.forEach(packageJsonPath => {
		var pkgPath = path.dirname(packageJsonPath);

		var content = JSON.parse(fs.readFileSync(packageJsonPath).toString());
		allPackages[content.name] = pkgPath;
	});

	return allPackages;
}

module.exports = function collectPackages(packageBasePath, packageNames, depth) {
	depth = depth || 0;
	var allPackages = getAllPackages(packageBasePath);

	if (packageNames) {
		return getPackageDependencies(packageBasePath, packageNames, depth).map(pkgName => allPackages[pkgName]);
	} else {
		return getAllTopologicallySortedPackageNames(packageBasePath).map(pkgName => allPackages[pkgName]);
	}
}
