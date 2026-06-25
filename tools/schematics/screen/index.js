const { externalSchematic } = require('@angular-devkit/schematics');

function screen(options) {
  return externalSchematic('@schematics/angular', 'component', {
    ...options,
    path: 'src/app/screens',
    type: 'screen'
  });
}

exports.screen = screen;
