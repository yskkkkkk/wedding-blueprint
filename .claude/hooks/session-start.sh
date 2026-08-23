#!/bin/bash
set -euo pipefail

# 세션(컨테이너)이 새로 만들어질 때마다 로컬 git identity가 기본값
# (Claude <noreply@anthropic.com>)으로 초기화되어, AI 세션이 만드는 커밋의
# author가 실제 작업 지시자와 다르게 찍히는 문제가 있었다.
#
# 협업 관계(누가 지시/검수했고 AI가 어떤 도구로 도왔는지)는 이미 각 커밋의
# `Co-Authored-By` 트레일러로 투명하게 남으므로, author 자체는 실제
# 개발자 이름으로 고정한다.
git config user.name "DAESUNG RYU"
git config user.email "fb1014@naver.com"
