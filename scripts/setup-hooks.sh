#!/bin/sh
# Configura o git para usar os hooks da pasta .githooks/
# Execute uma vez após clonar o repositório: make setup-hooks

git config core.hooksPath .githooks
chmod +x .githooks/*
echo "✅ Git hooks configurados. O push será bloqueado se lint, tipos ou build falharem."
