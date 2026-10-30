// runner — verdict.
out.push('');
out.push('NOTE: engine deterministic (seed 20261029); every receipt re-runs on each dispatch.');
out.push('VERDICT: '+(PASS+FAIL)+' checks, '+FAIL+' FAIL');
return {text:out.join('\n'),pass:PASS,fail:FAIL,total:PASS+FAIL};
