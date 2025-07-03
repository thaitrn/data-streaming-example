```curl -H "Content-Type: application/json" -d '{"contents":[{"parts":[{"text":"Test"}]}]}' "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=$GEMINI_API_KEY"

```curl -H "Authorization: Bearer $OPENAI_API_KEY" -H "Content-Type: application/json" -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"Test"}],"stream":true}' https://api.openai.com/v1/chat/completions

```curl -H "Authorization: Bearer $XAI_API_KEY" -H "Content-Type: application/json" -d '{"model":"grok-beta","messages":[{"role":"user","content":"Test"}]}' https://api.x.ai/v1/chat/completions