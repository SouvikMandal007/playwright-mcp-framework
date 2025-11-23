# Test Notifications Guide

## Overview

The framework supports automated test result notifications via Slack and Email, configured through GitHub Actions workflow.

## Slack Notifications

### Setup

1. **Create Slack App and Webhook**
   - Go to https://api.slack.com/apps
   - Create a new app
   - Enable Incoming Webhooks
   - Create a webhook URL for your channel

2. **Add Webhook to GitHub Secrets**
   ```bash
   # Go to Repository Settings > Secrets and variables > Actions
   # Add new secret:
   Name: SLACK_WEBHOOK_URL
   Value: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
   ```

3. **Configure Channel (Optional)**
   - Edit `.github/workflows/playwright.yml`
   - The webhook URL determines the channel

### Notification Format

Slack notifications include:
- Test result status (passed/failed)
- Branch name
- Commit SHA
- Link to GitHub Actions run
- Test execution details

### Custom Messages

Edit `.github/workflows/playwright.yml` to customize Slack message:

```yaml
- name: Send Slack notification
  uses: slackapi/slack-github-action@v1.25.0
  with:
    payload: |
      {
        "text": "Playwright Tests ${{ needs.test.result }}",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Playwright Test Results*\nStatus: ${{ needs.test.result }}\nBranch: ${{ github.ref_name }}\n<${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View Run>"
            }
          }
        ]
      }
```

### Advanced Slack Integration

#### Conditional Notifications

Only notify on failures:

```yaml
- name: Send Slack notification on failure
  if: ${{ needs.test.result == 'failure' }}
  uses: slackapi/slack-github-action@v1.25.0
  # ... rest of configuration
```

#### Include Test Statistics

```yaml
payload: |
  {
    "text": "Test Results: ${{ needs.test.result }}",
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Test Summary*\nTotal: 24 tests\nPassed: 20\nFailed: 4\n<${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View Details>"
        }
      }
    ]
  }
```

#### Mention Team on Failure

```yaml
"text": "<!channel> Tests failed on ${{ github.ref_name }}"
```

## Email Notifications

### Setup

1. **Configure Email Server**
   Add these secrets to GitHub repository:
   - `EMAIL_SERVER` - SMTP server address (e.g., smtp.gmail.com)
   - `EMAIL_PORT` - SMTP port (usually 587 for TLS)
   - `EMAIL_USERNAME` - Email account username
   - `EMAIL_PASSWORD` - Email account password or app password
   - `EMAIL_TO` - Recipient email address
   - `EMAIL_FROM` - Sender email address (optional, defaults to username)

2. **For Gmail**
   - Enable 2-factor authentication
   - Create an App Password
   - Use the app password as `EMAIL_PASSWORD`

3. **For Other Providers**
   - Check SMTP settings for your email provider
   - Ensure less secure app access is enabled if required

### Notification Content

Email notifications include:
- Subject: "Playwright Tests [status] - [repository]"
- Test result status
- Repository name
- Branch name
- Commit SHA
- Link to full test results

### Custom Email Template

Edit `.github/workflows/playwright.yml`:

```yaml
- name: Send Email notification
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: ${{ secrets.EMAIL_SERVER }}
    server_port: ${{ secrets.EMAIL_PORT }}
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: "🎭 Playwright Tests ${{ needs.test.result }} - ${{ github.repository }}"
    to: ${{ secrets.EMAIL_TO }}
    from: Playwright CI <${{ secrets.EMAIL_FROM }}>
    html_body: |
      <!DOCTYPE html>
      <html>
      <body>
        <h2>Playwright Test Results</h2>
        <table>
          <tr><td><strong>Status:</strong></td><td>${{ needs.test.result }}</td></tr>
          <tr><td><strong>Repository:</strong></td><td>${{ github.repository }}</td></tr>
          <tr><td><strong>Branch:</strong></td><td>${{ github.ref_name }}</td></tr>
          <tr><td><strong>Commit:</strong></td><td>${{ github.sha }}</td></tr>
        </table>
        <p><a href="${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}">View Full Results</a></p>
      </body>
      </html>
```

### Multiple Recipients

```yaml
to: team@example.com,qa@example.com,dev@example.com
```

### Attachments

Attach test report:

```yaml
- name: Send Email with report
  uses: dawidd6/action-send-mail@v3
  with:
    # ... other settings
    attachments: playwright-report/index.html
```

## Microsoft Teams Notifications

### Setup

1. **Create Incoming Webhook in Teams**
   - Open Teams channel
   - Click "..." > Connectors
   - Configure "Incoming Webhook"
   - Copy webhook URL

2. **Add to GitHub Secrets**
   ```
   Name: TEAMS_WEBHOOK_URL
   Value: Your webhook URL
   ```

3. **Add to Workflow**

```yaml
- name: Send Teams notification
  if: always()
  run: |
    curl -H 'Content-Type: application/json' \
    -d '{
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      "summary": "Test Results",
      "themeColor": "${{ needs.test.result == 'success' && '00FF00' || 'FF0000' }}",
      "title": "Playwright Test Results",
      "sections": [{
        "facts": [
          {"name": "Status:", "value": "${{ needs.test.result }}"},
          {"name": "Branch:", "value": "${{ github.ref_name }}"},
          {"name": "Commit:", "value": "${{ github.sha }}"}
        ]
      }],
      "potentialAction": [{
        "@type": "OpenUri",
        "name": "View Results",
        "targets": [{"os": "default", "uri": "${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"}]
      }]
    }' \
    ${{ secrets.TEAMS_WEBHOOK_URL }}
```

## Discord Notifications

### Setup

1. **Create Discord Webhook**
   - Go to Server Settings > Integrations
   - Create Webhook
   - Copy webhook URL

2. **Add to GitHub Secrets**
   ```
   Name: DISCORD_WEBHOOK_URL
   ```

3. **Add to Workflow**

```yaml
- name: Send Discord notification
  if: always()
  run: |
    curl -H "Content-Type: application/json" \
    -d '{
      "content": "**Playwright Test Results**",
      "embeds": [{
        "title": "Test Status: ${{ needs.test.result }}",
        "color": "${{ needs.test.result == 'success' && 65280 || 16711680 }}",
        "fields": [
          {"name": "Repository", "value": "${{ github.repository }}", "inline": true},
          {"name": "Branch", "value": "${{ github.ref_name }}", "inline": true},
          {"name": "Commit", "value": "${{ github.sha }}", "inline": false}
        ],
        "url": "${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"
      }]
    }' \
    ${{ secrets.DISCORD_WEBHOOK_URL }}
```

## Notification Best Practices

1. **Only Notify on Important Events**
   - Failures on main branch
   - Scheduled test runs
   - Deployment validations

2. **Include Context**
   - Branch name
   - Commit information
   - Links to results
   - Test statistics

3. **Control Frequency**
   - Avoid notification spam
   - Group notifications
   - Use summary notifications

4. **Security**
   - Never commit webhook URLs
   - Use GitHub Secrets
   - Rotate webhooks periodically

5. **Testing**
   - Test notifications in development
   - Use test channels initially
   - Verify formatting

## Conditional Notifications

### Only on Main Branch

```yaml
- name: Notify on main branch
  if: ${{ github.ref == 'refs/heads/main' && needs.test.result == 'failure' }}
```

### Only on Schedule

```yaml
- name: Notify scheduled runs
  if: ${{ github.event_name == 'schedule' }}
```

### Different Notifications by Result

```yaml
- name: Notify success
  if: ${{ needs.test.result == 'success' }}
  # Send success notification

- name: Notify failure
  if: ${{ needs.test.result == 'failure' }}
  # Send failure notification with more details
```

## Troubleshooting

### Slack Notifications Not Sending

- Verify webhook URL is correct
- Check webhook is added to GitHub Secrets
- Ensure workflow has permission to access secrets
- Check Slack app has proper permissions

### Email Not Delivering

- Verify SMTP settings
- Check email provider allows SMTP
- Enable app passwords for Gmail
- Verify all required secrets are set
- Check spam folder

### Notification Delays

- GitHub Actions may have delays
- Check Actions workflow execution time
- Consider using external notification services

## Examples

### Comprehensive Slack Notification

```yaml
- name: Slack Notification
  uses: slackapi/slack-github-action@v1.25.0
  with:
    payload: |
      {
        "text": "${{ needs.test.result == 'success' && '✅' || '❌' }} Tests ${{ needs.test.result }}",
        "blocks": [
          {
            "type": "header",
            "text": {
              "type": "plain_text",
              "text": "🎭 Playwright Test Results"
            }
          },
          {
            "type": "section",
            "fields": [
              {"type": "mrkdwn", "text": "*Status:*\n${{ needs.test.result }}"},
              {"type": "mrkdwn", "text": "*Branch:*\n${{ github.ref_name }}"},
              {"type": "mrkdwn", "text": "*Commit:*\n${{ github.sha }}"},
              {"type": "mrkdwn", "text": "*Author:*\n${{ github.actor }}"}
            ]
          },
          {
            "type": "actions",
            "elements": [
              {
                "type": "button",
                "text": {"type": "plain_text", "text": "View Results"},
                "url": "${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"
              }
            ]
          }
        ]
      }
```

## Integration with Monitoring Tools

### Datadog

```yaml
- name: Send metrics to Datadog
  run: |
    curl -X POST "https://api.datadoghq.com/api/v1/events" \
    -H "DD-API-KEY: ${{ secrets.DATADOG_API_KEY }}" \
    -d @- << EOF
    {
      "title": "Playwright Tests ${{ needs.test.result }}",
      "text": "Tests completed on ${{ github.ref_name }}",
      "tags": ["source:github", "env:ci"],
      "alert_type": "${{ needs.test.result == 'success' && 'success' || 'error' }}"
    }
    EOF
```

### New Relic

```yaml
- name: Send to New Relic
  run: |
    curl -X POST "https://insights-collector.newrelic.com/v1/accounts/$ACCOUNT_ID/events" \
    -H "Content-Type: application/json" \
    -H "X-Insert-Key: ${{ secrets.NEW_RELIC_INSERT_KEY }}" \
    -d '[{"eventType":"PlaywrightTest","result":"${{ needs.test.result }}","branch":"${{ github.ref_name }}"}]'
```
