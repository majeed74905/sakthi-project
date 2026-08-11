# AWS IAM Security & Access Policy Guide

## 1. Identity & Access Management (IAM) Rules
- **No AWS Root Account Usage**: The AWS root account is used strictly for billing and setup. All system operations use dedicated IAM users with Multi-Factor Authentication (MFA) enabled.
- **No Hardcoded Access Keys**: EC2 instances authenticate to AWS S3 using an attached **EC2 Instance Profile IAM Role** (`role-ec2-sakthi-backup`).

---

## 2. Recommended IAM Role Policy (`policy-ec2-s3-backup.json`)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3BackupAccess",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::sakthi-marketing-backups-secure",
        "arn:aws:s3:::sakthi-marketing-backups-secure/*"
      ]
    }
  ]
}
```

---

## 3. IAM Security Verification
- [x] Multi-Factor Authentication (MFA) enabled on all administrator accounts.
- [x] EC2 instance uses IAM Instance Profile (No `AWS_ACCESS_KEY_ID` in `.env` or Git).
- [x] S3 Bucket Policy blocks all unauthenticated public access.
