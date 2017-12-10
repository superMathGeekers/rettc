'use strict'
const exec = require('child_process').exec
const co = require('co')
const prompt = require('co-prompt')
const config = require('../templates')
const chalk = require('chalk')
const del = require('del')
const path = require('path')

module.exports = () => {
	co(function* () {
		let tplName = yield prompt('Template name: ')
		let projectName = yield prompt('Project name: ')
		let gitUrl
		let branch

		if (!config.tpl[tplName]) {
			console.log(chalk.red('\n × Template does not exit!'))
			process.exit()
		}
		gitUrl = config.tpl[tplName].url
		branch = config.tpl[tplName].branch

		let cmdStr = `git clone -b ${branch} ${gitUrl} ${projectName}`

		console.log(chalk.white('\n Start generating...'))

		exec(cmdStr, (error, stdout, stderr) => {
			if (error) {
				console.log(error)
				process.exit()
			}
			del([`${projectName}/\.git`, `!${projectName}/\..gitignore`], { force: true }).then(paths => {
				console.log(chalk.green('\n √ Deleted files and folders:\n'), paths.join('\n'))
				console.log(chalk.green('\n √ Generation completed!'))
				console.log(`\n cd ${projectName} && npm install \n`)
				exec('git init', { cwd: `.${path.sep}${projectName}` }, (error, stdout, stderr) => {
					if (error) {
						console.log(error)
					}
					process.exit()
				})
			});
		})
	})
}