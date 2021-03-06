import * as fs from 'fs';

// this is a workaround for issue lcov-result-merger
// https://github.com/mweibel/lcov-result-merger/issues/42

function fixReport(path: string) {
  let originlog: string = fs.readFileSync(path, 'utf8');
  let lastline = '';
  let beginline = 0;

  function replacer(match: string, m1: string, m2: string, m3: string) {
    if (match === 'end_of_record\n') {
      lastline = '';
      return match;
    }
    let n = parseInt(m2);
    if (m1 !== lastline) {
      lastline = m1;
      beginline = n;
    }
    return `${m1}${n - beginline}${m3}`;
  }

  let fixedlog = originlog.replace(/(?:(BRDA:\d+,)(\d+)(,\d+,\d+\n)|end_of_record\n)/g, replacer);

  fs.writeFileSync(path, fixedlog);

}

fixReport('coverage/chrome/karma.log');
fixReport('coverage/nyc.log');
fixReport('coverage/nyc-strict.log');