# is-even

[![Backend CI](https://github.com/Skona27/is-even/actions/workflows/backend.yml/badge.svg)](https://github.com/Skona27/is-even/actions/workflows/backend.yml) [![Frontend CI](https://github.com/Skona27/is-even/actions/workflows/frontend.yml/badge.svg)](https://github.com/Skona27/is-even/actions/workflows/frontend.yml)

SaaS platform for checking if a number is even.

Check out [Live](https://is-even.eu) version and [API Documentation](https://api.is-even.eu/docs).

## About project

This project is an example of a real-world production application. This project aims to show how one can implement a working system from start to end, deploy it and monitor it. Furthermore, it gathers some of the best practices of project development and maintenance. This project contains:

- modern Frontend application written in `Next.js`
- robust Backend application written in `Nest.js`
- infrastructure as a code with `AWS CDK`
- Typescript codebase for every application
- docker environment for local development
- monorepo manager to control all the and its dependencies
- CI/CD pipelines for running tests and deployment

The project is maintained as a monorepo. Each application or library is kept as a separate package. Monorepo introduces the ability to reuse code and detect cross-stack bugs early.

This whole project is a SaaS boilerplate, ready to copy and use accordingly to your start-up idea! Feel free to fork it and adjust to your needs.

## Prerequisites

The first step is to install `node` and `npm` globally on your machine.

You need to have `docker` and `docker-compose` installed on your computer to run the local environment. This project uses `Rush.js` as a monorepo manager. Check out the official [Rush docs](https://rushjs.io/pages/intro/get_started/) to set it up.

The backend application also uses `AWS Cognito`. Creating your user pool is unnecessary, but you will miss the core features like signup, login, or placing the orders.

Orders fulfillment depends on `Stripe` webhooks. For local development, you can use `Stripe CLI` to verify webhook calls. More on that on [official stripe docs](https://stripe.com/docs/webhooks/test).

## Run locally

To start the application locally, please follow the instruction specified below:

1. Clone this repository
2. Install dependencies with `rush update`
3. Go into `docker` dir
4. Set environment variables from template `.env` file
5. Run `rushx up` for spinning up the docker environment

Frontend service will start on port `3000`, and API service will start on port `4000`.

Behind the scenes, `rushx up` command will spin up the docker containers. Hot reloading is enabled because those containers have their volumes linked to the source files inside packages.

If you want to rebuild your docker images and containers, use `rushx build` to remove your environment and build it from the start.

## Documentation

The API documentation is autogenerated with `Swagger`. When running locally, it is available at `http://localhost:4000/docs`.
Please check out the live version of the documentation: [API documentation](https://api.is-even.eu/docs)

## Stack

Here are specified technologies that are used for this project, along with a short description of the production environment.

**Frontend**:

- React
- Next.js
- XState
- Chakra UI

**Backend**:

- Nest.js
- Typeorm
- Postgresql
- Typescript
- Jest
- AWS Cognito
- Stripe

**Infrastructure**:

- Docker (for the local environment)
- AWS CDK

**Other also important, but stack agnostic tools are:**

- Google Analytics,
- Sentry

Frontend application is deployed on `Vercel`, which is one of the first choices for deploying the `Next.js` application. Backend application is deployed on `AWS ElasticBeanstalk`. API depends on some other services like:

- AWS Cognito,
- AWS RDS,
- AWS S3

The DNS configurations are done via `AWS Route 53`, but they are not part of the infrastructure package.

## Missing features

Here is the list of missing features or possible improvements. This is not a closed list. Feel free to add some other requirements.

- [ ] Retry payment that was interrupted or failed
- [ ] Delete API Keys
- [ ] Prevent user from creating order if he still has the active credit
- [ ] Enable subscriptions with Stripe
- [ ] Split frontend to static landing page and dynamic Client application
- [ ] Move reusable types to shared packages (this may break the local docker environment, packages would need to have access to each other during installation)
- [ ] Integrate `GraphCMS` with Frontend
- [ ] Add workflow for Backend and Infrastructure automatic deployments
- [ ] Implement unit tests
- [ ] TBD...

## Contributing

Contributions make the open source community such a fantastic place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion to improve this, please fork the repo and create a pull request. You can also open an issue with the tag `enhancement`.

## Commit types

Each commit must follow convention specified in [conventional commit](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines) guidelines.

The shape of commit must be like:

```
<type>(<scope>): <subject>

// example
chore: update packages
```

Where `scope` is optional, but when used, it should match the package name e.g. `backend` or `frontend`.

While working on a feature, sometimes a situation may occur when it is more convenient to commit temporary changes for future rebase. To omit auto checking, command `git commit` must be called with `-n` or `--no-verify` flag.

```bash
git commit -nm 'WIP'
```

## Release

This application uses `Github Actions` workflow for releases and generating changelog.

Each commit pushed to `main` branch triggers the workflow in which `latest` tag is generated.
When tags are pushed to the `main` branch, another workflow is triggered, and as a result, a `release` is created. Release contains auto-generated changelog from commit history. Version bump to each package must be done manually when creating the specific tag.

The frontend application is deployed via `Vercel` on every release. Backend releases or Infrastructure updates are done manually from the CLI for now.

## Help

In case of a problem with the local environment or application itself, please visit the issues to see possible solutions or open a new issue.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details. Feel free to use this project as the base for your next application.

## Useful links

Here are specifies some useful links for administrating or monitoring the application.

- Email client: [Zoho mail](https://mail.zoho.eu/zm/)
- Stripe payments: [Stripe](https://dashboard.stripe.com/dashboard)
- Google analytics: [Analytics](https://analytics.google.com/analytics/web/#/p293916338/reports/reportinghub)
- Sentry reporting: [Sentry](https://sentry.io/organizations/is-even)

## Acknowledgments

Inspiration, code snippets, or useful articles:

- [Deploy scalable NodeJS application with Postgres database using AWS CDK](https://dev.to/skona27/deploy-scalable-nodejs-application-with-postgres-database-using-aws-cdk-22l4)
- [Control your Monorepo](https://dev.to/skona27/control-your-monorepo-2ka6)
