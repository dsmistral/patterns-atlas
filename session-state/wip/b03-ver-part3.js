// b03-review-verifier.js — part 3 of 3: pre-dispatch registry audit, dispatch, machine-counted verdicts
async function main(tools) {
  const read = async (p) => { let c = "", o = 0; while (true) { const r = await tools.file_system.read_file({ path: p, offset: o }); c += r.content; if (!r.was_truncated) break; o = r.next_offset; } return c; };
  const out = [];
  const P = (s) => out.push(s);
  const page = await read("/home/user/knowledge/graph-driven-math-book/wip/b03-euclidean-algorithm.html");
  // audit
  const ids = REG.map(r => r.id);
  const unique = ids.filter((x, i) => ids.indexOf(x) === i).length === ids.length;
  const injections = REG.filter(r => r.mustFail).length;
  const controls = REG.filter(r => !r.mustFail).length;
  const auditOk = REG.length === 16 && injections === 14 && controls === 2 && unique;
  P("b03-review-verifier (session S23, fresh engine: subtraction remainders, no % operator, zero shared code with the battery)");
  P("PRE-DISPATCH AUDIT: " + (auditOk ? "16/16 rows consistent (14 injections to refute, 2 controls to uphold, ids unique)" : "INCONSISTENT") + (unique ? "" : " — duplicate ids!"));
  let pass = 0, fail = 0, lines = 0;
  for (const r of REG) {
    let verdict, detail;
    try {
      const res = await r.fn(page);
      if (r.mustFail) {
        verdict = res.refuted ? "REFUTED" : "MISSED";
        detail = res.witness;
      } else {
        verdict = res.upheld ? "UPHELD" : "BROKEN";
        detail = res.witness;
      }
    } catch (e) {
      verdict = "ERROR";
      detail = String(e && e.message || e);
    }
    lines++;
    const ok = (r.mustFail && verdict === "REFUTED") || (!r.mustFail && verdict === "UPHELD");
    if (ok) pass++; else fail++;
    P("ROW " + r.id + " [" + (r.mustFail ? "must-refute" : "control") + "] '" + r.claim + "' -> " + verdict + " | " + detail);
  }
  P("VERDICT: " + lines + " verdict lines — " + pass + " PASS, " + fail + " FAIL");
  await tools.file_system.write_file({ path: "/home/user/knowledge/graph-driven-math-book/wip/b03-verifier-run.txt", content: out.join("\n") + "\n" });
  return out.join("\n");
}
