# usage ./put-url.sh key url
curl -X PUT \
"https://$API_PREFIX.execute-api.us-east-1.amazonaws.com/dev/links" \
-d '{ "Key": "'"$1"'", "WebsiteRedirectLocation": "'"$2"'"}'