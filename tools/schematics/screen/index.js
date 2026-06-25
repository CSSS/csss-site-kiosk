const { externalSchematic } = require('@angular-devkit/schematics');

function dasherize(value) {
  return value
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function getProjectPrefix(tree, projectName) {
  const workspace = JSON.parse(tree.read('angular.json').toString());
  const project = projectName ? workspace.projects[projectName] : Object.values(workspace.projects)[0];

  return project?.prefix ?? 'app';
}

function normalizeSelector(selector, type) {
  return selector.endsWith(`-${type}`) ? selector : `${selector}-${type}`;
}

function screen(options) {
  return (tree, context) => {
    const prefix = options.prefix ?? getProjectPrefix(tree, options.project);
    const selector = options.skipSelector
      ? undefined
      : normalizeSelector(options.selector ?? `${prefix}-${dasherize(options.name)}`, 'screen');

    const componentOptions = {
      ...options,
      selector,
      path: 'src/app/screens',
      type: 'screen'
    };

    return externalSchematic('@schematics/angular', 'component', componentOptions)(tree, context);
  };
}

exports.screen = screen;
