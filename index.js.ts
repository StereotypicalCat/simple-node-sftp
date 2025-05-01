// @ts-ignore
import Client from "ssh2-sftp-client";
let sftp = new Client();

import { program } from 'commander';
import * as fs from "node:fs";
import * as Path from "node:path";

program.name('Simple Node SFTP')
    .description("A simple node program to push or pull fi+les using ssh2-sftp-client")

program.command('upload')
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

program.command('download')
    .description('download files from a sftp server')
    .argument('<username>', 'username of sftp server')
    .argument('<password>', 'passwords of sftp server')
    .argument('<url>', 'url of sftp server')
    .argument('<port>', 'ports of sftp server')
    .argument('<src>', 'src path on remote machine of files to download')
    .argument('<dest>', 'src path on local server of files to download')
    .action((username: string, password: string, url: string, port: string, src: string, dest: string) => {
        importFromSFTP(username, password, url, port, src, dest);
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

const importFromSFTP = function (username: string, password: string, url: string, port: string, src: string, dest: string) {

    // Check whether file or dir
    let isDirectory: boolean = null

    sftp.connect({
        host: url,
        port: port,
        username: username,
        password: password
    }).then(() => {
        let stats = sftp.stat(src)
        isDirectory = stats.isDriectory
    }).catch(err => {
        console.log(err, 'catch error');
    }).then(() => {
        sftp.end();
    })

    console.log(isDirectory)

    if (isDirectory === null){
        console.log("The path you input is not exist!")
        return
    }

    if (isDirectory){
        // Connect!
        console.log("Creating a connection to SFTP server...")

        sftp.connect({
            host: url,
            port: port,
            username: username,
            password: password
        }).then(() => {
            return sftp.downloadDir(src, dest);
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
        fs.mkdirSync(dirToCreate, { recursive: true });

        sftp.connect({
            host: url,
            port: port,
            username: username,
            password: password
        }).then(() => {
            return sftp.get(src, dest)
        }).catch(err => {
            console.log(err, 'catch error');
        }).then(() => {
            sftp.end();
        })
    }
}

program.parse();