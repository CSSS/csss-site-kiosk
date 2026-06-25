const { externalSchematic } = require('@angular-devkit/schematics');

function widget(options) {
  return externalSchematic('@schematics/angular', 'component', {
    ...options,
    path: 'src/app/widgets',
    type: 'widget'
  });
}

exports.widget = widget;
