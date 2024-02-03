import path from 'path';
import fs from 'fs';
import cjs from '@rollup/plugin-commonjs';
import ts from 'rollup-plugin-typescript2';
import replace from '@rollup/plugin-replace';

const pkgsPath = path.resolve(__dirname, '../../packages');
const distPath = path.resolve(__dirname, '../../dist/node_modules');

/**
 * 获取dev和打包产物下当前包的路径
 * @param {string} pkgName 包名
 * @param {boolean} isDist 是否为打包产物
 * @returns {string} 对应环境下的包所在路径
 */
export function resolvePkgPath(pkgName, isDist) {
	if (isDist) {
		return `${distPath}/${pkgName}`;
	}
	return `${pkgsPath}/${pkgName}`;
}

/**
 * 读取对应包下的package.json文件
 * @param {string} pkgName 包名称
 * @returns {object} package.json对象
 */
export function getPkgJSON(pkgName) {
	const packageJSONPath = `${resolvePkgPath(pkgName)}/package.json`;
	const packageJSON = fs.readFileSync(packageJSONPath, { encoding: 'utf-8' });
	return JSON.parse(packageJSON);
}

export function getBasePluginConfig({
	alias = { __DEV__: true },
	typescript = {}
} = {}) {
	return [replace(alias), cjs(), ts(typescript)];
}
