import { NextPageContext } from 'next';
import Router from 'next/router';

export function makeTemporaryRedirect(ctx: NextPageContext, path: string) {
  if (ctx.req) {
    ctx.res.writeHead(302, {
      Location: path,
    });
    ctx.res.end();
  } else {
    Router.push(path);
  }
}
