#!/usr/bin/env node

'use strict'

const cp = require('child_process')
const fs = require('fs')
const path = require('path')
const Transform = require('stream').Transform

const Test262Stream = require('test262-stream')
const Interpreter = require('results-interpreter')
const Parser = require('tree-sitter')
const jsLanguage = require('..')

const test262Dir = path.join(__dirname, '..', 'test262')
const test262Revision = '89ec038cf2f12365aaf6f3862a361940c08ae19f'

const expectationsFile = path.join(__dirname, 'known_failures_test262.txt')
const shouldUpdate = process.argv.indexOf('--update-expectations') > -1
const normalizePath = (str) => str.split(path.sep).join(path.posix.sep)

const report = (summary) => {
  const goodnews = [
    summary.allowed.success.length + ' valid programs parsed without error',
    summary.allowed.failure.length +
    ' invalid programs produced a parsing error',
    summary.allowed.falsePositive.length +
    ' invalid programs did not produce a parsing error' +
    ' (and allowed by the expectations file)',
    summary.allowed.falseNegative.length +
    ' valid programs produced a parsing error' +
    ' (and allowed by the expectations file)'
  ]
  const badnews = []
  const badnewsDetails = []

  void [
    {
      tests: summary.disallowed.success,
      label:
      'valid programs parsed without error' +
      ' (in violation of the expectations file)'
    },
    {
      tests: summary.disallowed.failure,
      label:
      'invalid programs produced a parsing error' +
      ' (in violation of the expectations file)'
    },
    {
      tests: summary.disallowed.falsePositive,
      label:
      'invalid programs did not produce a parsing error' +
      ' (without a corresponding entry in the expectations file)'
    },
    {
      tests: summary.disallowed.falseNegative,
      label:
      'valid programs produced a parsing error' +
      ' (without a corresponding entry in the expectations file)'
    },
    {
      tests: summary.unrecognized,
      label: 'non-existent programs specified in the expectations file'
    }
  ].forEach((entry) => {
    const tests = entry.tests
    const label = entry.label

    if (!tests.length) {
      return
    }

    const desc = tests.length + ' ' + label

    badnews.push(desc)
    badnewsDetails.push(desc + ':')
    badnewsDetails.push(...tests.map((test) => test.id || test))
  })

  console.log('Testing complete.')
  console.log('Summary:')
  console.log(goodnews.join('\n').replace(/^/gm, ' ✔ '))

  if (!summary.passed) {
    console.log('')
    console.log(badnews.join('\n').replace(/^/gm, ' ✘ '))
    console.log('')
    console.log('Details:')
    console.log(badnewsDetails.join('\n').replace(/^/gm, '   '))
  }
}

const parser = new Parser()
parser.setLanguage(jsLanguage)
const stream = new Test262Stream(test262Dir, { omitRuntime: true })
const runTest = (test) => {
  // TODO: use dedicated 'module' parse goal for module code
  //const isModule = !!test.attrs.flags.module

  return !/ERROR/.test(parser.parse(test.contents).rootNode.toString())
}
let count = 0

const results = new Transform({
  objectMode: true,
  transform: (test, encoding, done) => {
    count += 1
    if (count % 2000 === 0) {
      console.log('Completed ' + count + ' tests.')
    }

    done(null, {
      id: normalizePath(test.file) + '(' + test.scenario + ')',
      expected: test.attrs.negative && test.attrs.negative.phase === 'parse'
        ? 'fail' : 'pass',
      actual: runTest(test) ? 'pass': 'fail'
    })
  }
})
const interpreter = new Interpreter(expectationsFile, {
  outputFile: shouldUpdate ? expectationsFile : null
})

if (!fs.existsSync(test262Dir)) {
  console.log('Cloning Test262...')

  const cloneResult = cp.spawnSync('git', [
    'clone', 'https://github.com/tc39/test262', test262Dir,
  ])

  if (cloneResult.status) {
    throw new Error(String(cloneResult.stderr))
  }
}

console.log(`Checking out revision ${test262Revision}...`)

const resetResult = cp.spawnSync(
  'git',
  ['reset', '--hard', test262Revision],
  { cwd: test262Dir }
)

if (resetResult.status) {
  throw new Error(String(resetResult.stderr))
}

console.log('Now running tests...')

if (shouldUpdate) {
  console.log(
    'The expectations file will be updated according to the results of this ' +
    'test run.'
  )
} else {
  console.log(
    'Note: the expectations file may be automatically updated by specifying ' +
    'the `--update-expectations` flag.'
  )
}

stream.pipe(results)
  .pipe(interpreter)
  .on('error', (error) => {
    console.error(error)
    process.exitCode = 1
  })
  .on('finish', function() {
    report(this.summary)
    process.exitCode = this.summary.passed ? 0 : 1
  })
