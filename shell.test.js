///usr/bin/env bun test "$0" "$@" ; exit $?

import { $ } from "bun";
import { expect, test } from "bun:test";

test("run a successful shell cmd", async () => {
  const { stdout, stderr, exitCode } = await $`echo "hi"`.quiet();
  expect(exitCode).toEqual(0);
  expect(stdout.toString()).toEqual("hi\n");
  expect(stderr.toString()).toEqual("");
});

test("run a failed shell cmd", async () => {
  const { stdout, stderr, exitCode } = await $`bunnn`.quiet();
  expect(exitCode).toEqual(1);
  expect(stdout.toString()).toEqual("");
  expect(stderr.toString()).toEqual("bun: command not found: bunnn\n");
});

test("run a failed shell cmd and throw error", async () => {
  $.throws(true);
  try {
    await $`bunnn`.quiet();
  } catch (e) {
    expect(e.exitCode).toEqual(1);
    expect(e.stdout.toString()).toEqual("");
    expect(e.stderr.toString()).toEqual("bun: command not found: bunnn\n");
  }
});

test("text(): if exitCode == 0, return stdout else throw error", async () => {
  // ok
  const stdoutText = await $`echo hi`.quiet().text();
  expect(stdoutText).toEqual("hi\n");

  // err
  try {
    await $`bunnn`.quiet().text();
  } catch (e) {
    expect(e.exitCode).toEqual(1);
    expect(e.stdout.toString()).toEqual("");
    expect(e.stderr.toString()).toEqual("bun: command not found: bunnn\n");
  }
});

test("text(base64)", async () => {
  const base64 = await $`echo hi`.quiet().text("base64");
  expect(base64).toEqual("aGkK");
});
