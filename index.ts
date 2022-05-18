#!/usr/bin/env node
import { Stack, StackProps, App } from "aws-cdk-lib";
import { StaticSite, StaticSiteProps } from './static-site';
import * as fs from "fs";

interface LocalConfig {
    account: string
    region: string
}

var lclCfg = JSON.parse(fs.readFileSync('config/local.json', 'utf-8')) as LocalConfig;
var projectConfig = JSON.parse(fs.readFileSync('config/base.json', 'utf-8')) as StaticSiteProps;

const envSheeta = { region: lclCfg.region, account: lclCfg.account };

class GmcStaticSite extends Stack {
    constructor(parent: App, name: string, props: StackProps) {
        super(parent, name, props);
        new StaticSite(this, 'GmcStaticSite-test', projectConfig);
    }
}

const app = new App();

new GmcStaticSite(app, 'GmcStaticSite-test', {
    env: envSheeta,
    ...projectConfig
});

app.synth();
