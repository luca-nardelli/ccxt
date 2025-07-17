# How to update the fork and the other branches

- `git checkout master`
- Reset to the desired tag/commit: `git reset --hard <tag>`
- Rebase `fork-base` on master `git rebase -i master` and fix conflicts
- Rebase all feature branches on `fork-base`
- `git checkout fork`
- `git reset --hard fork-base`
- Then merge all feature branches into `fork`

# List of branches
feat/woo-watch-balance
fix/mexc-nonce-error
fix/mexc-nonce-out-of-order-loop
feat/perf
feat/bbo
feat/perf-unsafe
fix-kraken-checksum