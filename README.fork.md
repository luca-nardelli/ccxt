# How to update the fork and the other branches

- `git checkout master`
- Reset to the desired tag/commit: `git reset --hard <tag>`
- Rebase `fork-base` on master `git rebase -i master` and fix conflicts
- Rebase all feature branches on `master`
- `git checkout fork`
- `git reset --hard fork-base`
- Then merge all feature branches into `fork`
- In order to build, run `npm run tsBuild && npm run bundle`

# List of commands
git checkout feat/woo-watch-balance && git rebase fork-base
git checkout fix/mexc-nonce-error && git rebase fork-base
git checkout fix/mexc-nonce-out-of-order-loop && git rebase fork-base
git checkout feat/perf && git rebase fork-base
git checkout feat/bbo && git rebase fork-base
git checkout feat/perf-unsafe && git rebase fork-base
git checkout fix-kraken-checksum && git rebase fork-base
git checkout fix/bitget-uta && git rebase fork-base
