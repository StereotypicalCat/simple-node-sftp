// @ts-ignore
import Client from "ssh2-sftp-client";

let sftp = new Client();

import { program } from 'commander';
import * as fs from "node:fs";
import * as Path from "node:path";


program.name('Simple Node SFTP')
    .description("A simple node program to push or pull fi+les using ssh2-sftp-client")

program.command('push')
    .description('upload files to a sftp server')
    .argument('<username>', 'username of sftp server')
    .argument('<password>', 'passwords of sftp server')
    .argument('<url>', 'url of sftp server')
    .argument('<port>', 'ports of sftp server')
    .argument('<src>', 'src path on local machine of files to upload')
    .argument('<dest>', 'dest path on remote server of files to upload')
    .action((username: string, password: string, url: string, port: string, src: string, dest: string) => {
        exporToSFTP(username, password, url, port, src, dest);
    })

const exporToSFTP = function (username: string, password: string, url: string, port: string, src: string, dest: string) {

    // Check whether file or dir
    let isDirectory: boolean = fs.lstatSync(src).isDirectory()
    console.log(isDirectory)

    if (isDirectory){
        // Connect!
        console.log("Creating a connection to SFTP server...")

        sftp.connect({
            host: url,
            port: port,
            username: username,
            password: password
        }).then(() => {
            return sftp.uploadDir(src, dest);
        }).then(data => {
            console.log(data, 'the data info');
        }).catch(err => {
            console.log(err, 'catch error');
        }).then(() => {
            sftp.end();
        })
    }
    else{
        // Connect!
        console.log("Creating a connection to SFTP server...")

        const dirToCreate = Path.dirname(dest)
        console.log(dirToCreate);

        sftp.connect({
            host: url,
            port: port,
            username: username,
            password: password
        }).then(() => {
            return sftp.mkdir(dirToCreate, true);
        }).then(() => {
            return sftp.put(src, dest);
        }).then(data => {
            console.log(data, 'the data info');
        }).catch(err => {
            console.log(err, 'catch error');
        }).then(() => {
            sftp.end();
        })
    }
}



program.parse();