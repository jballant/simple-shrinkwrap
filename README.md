simple-shrinkwrap
=================

A command-line tool to perform make an npm compatible npm-shrinkwrap file with only the necessary information.

Additionally, defaults to perform 'dev' installs unless '--production' argument is used.

```
# dev build (simple-shrinkwrap will save dependencies and devDependencies)
simple-shrinkwrap

# prod build (simple-shrinkwrap will save only dependencies);
simple-shrinkwrap --production
```