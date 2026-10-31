# Security Fixes Changelog

_Gerado automaticamente pelo workflow de segurança._

## 2026-10-31

- **Cronicas App:** @eslint-community/eslint-utils `?` → `4.0.0` — _eslint_ (moderate, remanescente)
- **Cronicas App:** @eslint/config-array `?` → `4.0.0` — _minimatch_ (moderate, remanescente)
- **Cronicas App:** eslint `?` → `4.0.0` — _@eslint-community/eslint-utils_ (moderate, remanescente)
- **Cronicas App:** minimatch `<11.0.1` → `4.0.0` — _minimatch has potential denial of service via globparts amplification_ (moderate, remanescente)
- **Cronicas App:** @eslint/js `10.0.1` → `10.0.0` — _eslint_ (moderate, corrigida)
- **Cronicas App:** nodemon `1.19.4` → `1.0.2` — _minimatch_ (moderate, corrigida)
- Pipeline: https://github.com/masneto/cronicas-app/actions/runs/41158743893

## 2026-10-24

- **Cronicas App:** body-parser `2.3.0` → `2.4.0` — _body-parser vulnerable to Denial of Service via trailing bytes after a compressed request body_ (high, corrigida)
- Pipeline: https://github.com/masneto/cronicas-app/actions/runs/40071983558

## 2026-10-06

- **Cronicas App:** proxy-addr `2.0.7` → `2.0.8` — _proxy-addr vulnerable to IP spoofing via IPv4-mapped IPv6 trust subnet_ (critical, corrigida)
- Pipeline: https://github.com/masneto/cronicas-app/actions/runs/37437225251

## 2026-10-03

- **Cronicas App:** braces `3.0.3` → `não informado` — _braces vulnerable to stack-exhaustion denial of service through deeply nested patterns_ (high, corrigida)
- **Cronicas App:** chokidar `3.6.0` → `5.0.0` — _braces_ (high, corrigida)
- **Cronicas App:** nodemon `3.1.14` → `1.19.4` — _chokidar_ (high, corrigida)
- Pipeline: https://github.com/masneto/cronicas-app/actions/runs/37107036768

## 2026-09-30

- **Cronicas App:** brace-expansion `5.0.9` → `5.0.12` — _brace-expansion: Quadratic-time expansion of the `{a},b}` rewrite causes CPU denial of service_ (high, corrigida)
- Pipeline: https://github.com/masneto/cronicas-app/actions/runs/36687374694

## 2026-09-06

- **Cronicas App:** body-parser `>=2.0.0 <2.3.0` → `disponivel` — _body-parser vulnerable to denial of service when invalid limit value silently disables size enforcement_ (low)
- **Cronicas App:** express `?` → `disponivel` — _body-parser_ (low)
- Pipeline: https://github.com/masneto/cronicas-app/actions/runs/34061359551

## 2026-09-06

- **Cronicas App:** body-parser `>=2.0.0 <2.3.0` → `disponivel` — _body-parser vulnerable to denial of service when invalid limit value silently disables size enforcement_ (low)
- Pipeline: https://github.com/masneto/cronicas-app/actions/runs/34061153322

## 2026-09-06

- **Cronicas App:** body-parser `>=2.0.0 <2.3.0` → `disponivel` — _body-parser vulnerable to denial of service when invalid limit value silently disables size enforcement_ (low)
- **Cronicas App:** lodash `<4.17.21` → `4.18.1` — _Command Injection in lodash_ (high)
- **Cronicas App:** minimist `>=1.0.0 <1.2.6` → `1.2.8` — _Prototype Pollution in minimist_ (critical)
- **Cronicas App:** xml2js `<0.5.0` → `0.6.2` — _xml2js is vulnerable to prototype pollution_ (moderate)
- Pipeline: https://github.com/masneto/cronicas-app/actions/runs/34061022632

## 2026-09-06

- **Cronicas App:** lodash `<4.17.21` → `4.18.1` — _Command Injection in lodash_ (high)
- Pipeline: https://github.com/masneto/cronicas-app/actions/runs/34060406293

## 2026-08-09

- js-yaml `>=3.0.0 <3.15.1` → `3.15.1` — _JS-YAML: Quadratic CPU consumption in !!omap resolution (3.x and 4.x)_ (high)
- Pipeline: https://github.com/masneto/cronicas-app/actions/runs/31624567115
