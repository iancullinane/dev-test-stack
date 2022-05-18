import { Stack } from "aws-cdk-lib";
import { Construct } from 'constructs';
import * as pants from "@ianpants/pants-constructs";

export interface StaticSiteProps {
  domainName: string;
  siteSubDomain?: string;
  certArn?: string;
}

/**
 * Static site infrastructure, which deploys site content to an S3 bucket.
 *
 * The site redirects from HTTP to HTTPS, using a CloudFront distribution,
 * Route53 alias record, and ACM certificate.
 */
export class StaticSite extends Construct {
  constructor(parent: Stack, name: string, props: StaticSiteProps) {
    super(parent, name);

    const fqdn = (props.siteSubDomain)
      ? `${props.siteSubDomain}.${props.domainName}`
      : `${props.domainName}`;

    const hostedZone = new pants.HostedZoneLookupStack(this, `hostedzone-${props.domainName}`, {
      // const zone = route53.HostedZone.fromHostedZoneId(this, 'GMCTopLevelZone', props.hostedZoneID);
      domainName: props.domainName
    })

    new pants.StaticSiteWithCloudfront(this, `site-stack-${fqdn}`, {
      hostedZone: hostedZone.hz,
      fqdn
    })

  }
}
