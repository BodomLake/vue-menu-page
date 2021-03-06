/**
 * 遍历当前 文件夹(__dirname) 生产index.html 作为目录
 */
var fs = require("fs");
var path = require("path");
// 本地引入colors库
var colors = require("colors");
const { cwd } = require("process");
var printTreeInConsole = true;
// 忽略掉的选项
var ignoreItem = [
	"node_modules",
	"filePath.js",
	".git",
	// ".gitignore",
	// ".vscode",
	".idea",
];
class File {
	constructor(name, absPath, relPath, type, size, comment, tag) {
		this.name = name || "";
		this.absPath = absPath || "";
		this.relPath = relPath || "";
		this.comment = comment || "";
		this.tag = tag || "";
		this.size = size || 0;
		this.type = type || "";
	}
}
class Directory {
	constructor(name, absPath, relPath, comment, tag) {
		this.files = [];
		this.directories = [];
		this.name = name || "";
		this.absPath = absPath || "";
		this.relPath = relPath || "";
		this.comment = comment || "";
		this.tag = tag || "";
	}
	addFile(f) {
		this.files.push(f);
		return this;
	}
	addDirectory(d) {
		this.directories.push(d);
		return this;
	}
}
// console.log("__dirname".blue, __dirname);
// console.log("__filename:".blue, __filename);
// var platform = process.platform;
// console.log("The opreation system:".red, platform);

var targetDirectory;
//  根据深度显示标志
function depthSymbol(depth, isDir) {
	var symbol = "";
	if (depth == 1) {
		return "* ";
	}
	do {
		symbol += "  ";
		depth--;
	} while (depth > 0);
	return isDir ? symbol + "* " : symbol + "|-";
}
// readContentSync第一次指定的路径
var distPath = "";
/**
 *
 * @param {文件夹路径} dirPath
 * @param {深度限制，默认为无限大} depthLimit
 * @param {当前文件夹深度默认为} depth
 */
function readContentSync(
	dirPath = __dirname,
	depthLimit = Infinity,
	depth = 0,
	itemName
) {
	// 初始化 指定为当前所在文件夹
	let directory;
	if (depth == 0) {
		distPath = dirPath;
		directory = new Directory(path.resolve(__dirname, "./"));
		// console.log("初始化所在文件夹:", directory.name);
	} else {
		// console.log(__dirname,dirPath, itemName);
		directory = new Directory(
			itemName,
			path.resolve(dirPath, itemName),
			// 相对路径
			path.relative(__dirname, dirPath)
		);
		// console.log("所在文件夹:", directory.name);
	}
	// 读取该文件夹
	var dir = fs.readdirSync(dirPath);
	// 文件夹深度加大 默认首次会变成1; 也可以认为是 递归深度
	depth++;
	// console.log('dirs:',dir)
	for (let i = 0; i < dir.length; i++) {
		let itemName = dir[i];
		// 找到该文件夹下的文件
		let absPath = path.resolve(dirPath, itemName);
		// console.log('===》目录下的文件/文件夹', absPath)
		if (depth > depthLimit) {
			break;
		}
		if (!ignoreItem.includes(itemName)) {
			const stat = fs.statSync(absPath);
			//是文件夹
			if (stat.isDirectory()) {
				// 输出相对路径子项的路径
				// let relativePath = path.relative(__dirname, absPath);
				// console.log(depthSymbol(depth, false) + relativePath);
				// 输出文件名字
				if (printTreeInConsole) {
					// console.log(depthSymbol(depth, true) + itemName.yellow);
				}
				// 递归向内查找,并且返回该文件夹的内容
				directory.addDirectory(
					readContentSync(absPath, depthLimit, depth, itemName)
				);
			} // 是文件
			else if (stat.isFile()) {
				// 输出相对路径  'File:',
				let relativePath = path.relative(__dirname, absPath);
				// console.log(depthSymbol(depth, false) , path.relative(__dirname, absPath))
				// 输出名字
				if (printTreeInConsole) {
					let fileName = itemName.green;
					// console.log(depthSymbol(depth, false) + fileName);
				}
				let f = new File(itemName, absPath, relativePath);
				f.size = stat.size;
				// 如果名字可以用点分开，就去最后一部分作为文件类型
				f.type =
					absPath.split(".").length > 1 ? absPath.split(".").slice(-1)[0] : "";
				directory.addFile(f);
			}
		}
	}
	return directory;
}

// readContentSync(__dirname, 10);
// targetDirectory = readContentSync(__dirname, 10);
// console.log(targetDirectory)
module.exports = {
	readContentSync,
};
