# Public SSH Guide for spark-learners

This guide explains how to use SSH with the spark-learners repository (ayebazibwexavier-debug/spark-learners). It covers creating SSH keys, adding them to GitHub, cloning the repo with SSH, configuring multiple keys, and troubleshooting.

## Purpose

Using SSH keys for Git operations provides a secure, convenient way to authenticate with GitHub without typing your username and password each time.

## Prerequisites

- Git installed (https://git-scm.com/)
- Terminal (macOS/Linux) or Git Bash / WSL on Windows
- A GitHub account with permission to access this repository

## 1) Generate an SSH key (macOS / Linux / Git Bash)

Open a terminal and run:

```bash
# replace the email with your GitHub email
ssh-keygen -t ed25519 -C "your_email@example.com"

# if your system doesn't support ed25519, use:
# ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

When prompted, accept the default file location (~/.ssh/id_ed25519) or provide a descriptive name (recommended if you use multiple keys), e.g. `~/.ssh/id_ed25519_spark-learners`.

Optionally set a passphrase for additional security.

## 2) Add your SSH key to the ssh-agent

Start the agent and add your key:

```bash
# start the agent
eval "$(ssh-agent -s)"

# add your key (use the file you created above)
ssh-add ~/.ssh/id_ed25519
# or if you used a custom name:
# ssh-add ~/.ssh/id_ed25519_spark-learners
```

On macOS you may also want to configure the key to be stored in the macOS keychain:

```bash
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
```

On Windows (Git Bash) use the same `ssh-add` command in Git Bash, or if using PuTTY, use PuTTYgen and Pageant (see below).

## 3) Copy the public key and add it to GitHub

Copy the public key to your clipboard:

```bash
# default path
cat ~/.ssh/id_ed25519.pub | clip # Windows (Git Bash: use 'clip')
cat ~/.ssh/id_ed25519.pub | pbcopy # macOS
xclip -sel clip < ~/.ssh/id_ed25519.pub # Linux (with xclip)
```

Then on GitHub:

- To add a key to your user account: go to https://github.com/settings/keys -> "New SSH key". Paste the public key and give it a descriptive title (e.g. "spark-learners laptop").
- To add a repository deploy key (read-only or read/write for CI): go to this repository's Settings -> Deploy keys -> "Add deploy key". Paste the public key and choose whether it should allow write access.

Note: Repository deploy keys grant access to that repository only. Personal SSH keys added under your account grant access to all repositories you can access.

## 4) Test your SSH connection

Run:

```bash
ssh -T git@github.com
```

Expected message for an authenticated account:

"Hi <username>! You've successfully authenticated, but GitHub does not provide shell access." 

If you see a permission denied message, verify the key was added correctly to your GitHub account and that the ssh-agent is running with the key loaded.

## 5) Clone the repository using SSH

Use the SSH clone URL for this repository:

```bash
git clone git@github.com:ayebazibwexavier-debug/spark-learners.git
```

If you already have an HTTPS remote and want to switch to SSH:

```bash
# from inside the repository
git remote set-url origin git@github.com:ayebazibwexavier-debug/spark-learners.git
```

## 6) Using multiple SSH keys (optional)

If you use different SSH keys for different accounts/projects, add a config file to `~/.ssh/config` to pick the correct key per host or repository. Example:

```
# default GitHub key
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519
  IdentitiesOnly yes

# specific identity for spark-learners repo (optional)
Host github-spark-learners
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_spark-learners
  IdentitiesOnly yes
```

Then clone using the alias host when needed:

```bash
git clone git@github-spark-learners:ayebazibwexavier-debug/spark-learners.git
```

This config approach prevents SSH from offering the wrong key to GitHub when multiple keys exist.

## 7) Windows (PuTTY) quick notes

If you use PuTTY:

- Generate keys with PuTTYgen and save the private key (.ppk) and public key.
- Load the private key into Pageant (PuTTY’s SSH agent).
- Copy the public key text from PuTTYgen and add it to GitHub (https://github.com/settings/keys).
- In PuTTY, use `git@github.com` as the username/host for connections or use Git Bash with the OpenSSH client bundled with Git for Windows.

## 8) Troubleshooting

- Permission denied (publickey): Ensure the public key is added to GitHub and the private key is loaded in your ssh-agent.
- Wrong key used: Confirm `ssh -vT git@github.com` to see which key is offered. Use `~/.ssh/config` to force a specific key.
- Multiple identities: set `IdentitiesOnly yes` in your SSH config to prevent the client from trying other keys.
- File permissions: make sure private keys are not world-readable: `chmod 600 ~/.ssh/id_ed25519`.

## 9) Security best practices

- Use ed25519 keys where possible. If you must use RSA, use at least 4096 bits.
- Protect your private keys with a passphrase.
- Use deploy keys for CI or server-specific access where possible.
- Remove keys from GitHub when a machine is decommissioned or lost.

## 10) Contact / Support

If you have trouble setting up SSH for this repository, open an issue in this repository describing the problem and paste any relevant error messages from `ssh -vT git@github.com`.

---

Created by repository maintainers to help contributors connect to this project via SSH.
