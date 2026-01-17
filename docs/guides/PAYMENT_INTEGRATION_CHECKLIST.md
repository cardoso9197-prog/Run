# Payment Integration Checklist
## Run-Run Guinea-Bissau - Complete Action Plan

**Developer:** Edivaldo Cardoso  
**Email:** suporte@runrungb.com  
**Phone:** +245 955 971 275  
**Status:** Ready to Start Provider Registration  
**Date Created:** January 6, 2026  
**Estimated Completion:** February 28, 2026 (8 weeks)

---

## ✅ PHASE 1: CODE PREPARATION (COMPLETED)

- [x] Create PayStack service integration (`backend/services/paystack.service.js`)
- [x] Create Orange Money service integration (`backend/services/orangemoney.service.js`)
- [x] Create MTN MoMo service integration (`backend/services/mtnmomo.service.js`)
- [x] Update payment routes with real processing (`backend/routes/payments-updated.js`)
- [x] Draft professional emails to providers (`docs/guides/PAYMENT_PROVIDER_EMAILS.md`)
- [x] Create implementation guide (`docs/guides/PAYMENT_INTEGRATION_IMPLEMENTATION.md`)
- [x] Create action checklist (this file)

**Result:** 🎉 All integration code is complete and ready!

---

## 📧 PHASE 2: PROVIDER REGISTRATION (CURRENT PHASE)

### Week 1: Initial Contact

#### PayStack (Priority #1)
- [ ] Fill in your contact details in email template
- [ ] Send email to: support@paystack.com
- [ ] Send email to: sales@paystack.com
- [ ] Visit: https://dashboard.paystack.com/signup
- [ ] Complete online registration form
- [ ] Upload required documents (ID, business info)
- [ ] **Expected:** Receive test keys within 24 hours

#### Orange Money Guinea-Bissau (Priority #2)
- [ ] Visit Orange store in Bissau
- [ ] Ask for "Departamento Comercial" contact
- [ ] Get email address for Orange Money merchant team
- [ ] Fill in Portuguese email template with your details
- [ ] Send email to Orange Money merchant team
- [ ] Schedule in-person meeting
- [ ] Prepare documents: ID, business registration, bank details
- [ ] **Expected:** Response within 3-5 days

#### MTN Mobile Money Guinea-Bissau (Priority #3)
- [ ] Visit MTN store in Bissau
- [ ] Ask for "MTN MoMo Business" department
- [ ] Get email address for MTN MoMo merchant team
- [ ] Fill in Portuguese email template with your details
- [ ] Send email to MTN MoMo team
- [ ] Register at: https://momodeveloper.mtn.com
- [ ] Request sandbox access (immediate)
- [ ] Schedule in-person meeting
- [ ] **Expected:** Sandbox access in 1-2 days

#### Cinetpay (Alternative/Backup)
- [ ] Send email to: support@cinetpay.com
- [ ] Visit: https://cinetpay.com
- [ ] Complete merchant application
- [ ] **Expected:** Response within 3-7 days

---

## 🔧 PHASE 3: BACKEND CONFIGURATION

### Local Setup
- [ ] Install required packages: `npm install axios uuid`
- [ ] Verify all service files exist in `backend/services/`
- [ ] Rename `payments-updated.js` to `payments.js` (backup old version)
- [ ] Test backend locally without credentials (should show warnings)

### Environment Variables Setup
- [ ] Create `.env` file in backend folder
- [ ] Add placeholder values for all payment providers
- [ ] Add existing `DATABASE_URL` and other variables
- [ ] **Do NOT commit .env to Git** (add to .gitignore)

---

## 🧪 PHASE 4: SANDBOX TESTING

### PayStack Testing (Once Test Keys Received)
- [ ] Add `PAYSTACK_SECRET_KEY` to Railway environment variables
- [ ] Add `PAYSTACK_PUBLIC_KEY` to Railway environment variables
- [ ] Configure webhook URL in PayStack dashboard
- [ ] Test card payment with test card: 4084084084084081
- [ ] Test declined card: 5060666666666666666
- [ ] Verify transaction appears in PayStack dashboard
- [ ] Test webhook notifications
- [ ] Test saved card charging
- [ ] **Expected:** All tests pass in sandbox

### Orange Money Testing (Once Sandbox Access Received)
- [ ] Add Orange Money credentials to Railway
- [ ] Get test phone number from Orange
- [ ] Test payment initiation
- [ ] Test payment status check
- [ ] Test callback/webhook handling
- [ ] Verify payment in Orange Money merchant portal
- [ ] **Expected:** Successful sandbox transactions

### MTN MoMo Testing (Once Sandbox Access Received)
- [ ] Add MTN MoMo credentials to Railway
- [ ] Get MTN sandbox test number
- [ ] Test request to pay (collections)
- [ ] Test status checking
- [ ] Test callback notifications
- [ ] Test disbursement (driver payout)
- [ ] **Expected:** All sandbox tests successful

---

## 🏢 PHASE 5: BUSINESS VERIFICATION

### PayStack Production Approval
- [ ] Submit business verification documents
- [ ] Provide bank account for settlements
- [ ] Wait for approval (2-5 business days)
- [ ] Receive production API keys
- [ ] Update Railway with production keys
- [ ] **Expected:** Production access granted

### Orange Money Production Access
- [ ] Complete merchant account application
- [ ] Submit all required documents
- [ ] Sign merchant agreement
- [ ] Provide bank details for settlements
- [ ] Receive production API credentials
- [ ] Update Railway with production credentials
- [ ] **Expected:** Production access in 1-2 weeks

### MTN MoMo Production Access
- [ ] Complete production access application
- [ ] Submit business verification documents
- [ ] Sign API usage agreement
- [ ] Receive production subscription keys
- [ ] Update MTN_MOMO_ENVIRONMENT to "production"
- [ ] Update Railway with production credentials
- [ ] **Expected:** Production access in 1-2 weeks

---

## 🚀 PHASE 6: PRODUCTION DEPLOYMENT

### Pre-Launch Checklist
- [ ] All three payment providers in production mode
- [ ] Environment variables updated on Railway
- [ ] Backend redeployed with production credentials
- [ ] Test with small real amounts (100-500 XOF)
- [ ] Verify payment status updates correctly
- [ ] Test driver payout with small amount
- [ ] Check webhook notifications working
- [ ] Review Railway logs for errors
- [ ] Test from mobile apps (passenger & driver)
- [ ] Verify admin dashboard shows real transactions

### Security Audit
- [ ] Verify webhook signature validation working
- [ ] Check API keys not exposed in frontend
- [ ] Confirm HTTPS used for all payment URLs
- [ ] Test error handling for failed payments
- [ ] Verify user cannot access other users' payment methods
- [ ] Check SQL injection protection
- [ ] Verify XSS protection in payment forms

### Load Testing
- [ ] Test 10 simultaneous payments
- [ ] Test payment during high traffic
- [ ] Verify database handles concurrent transactions
- [ ] Check Railway performance metrics
- [ ] Monitor response times

### Documentation
- [ ] Update API documentation with real payment flows
- [ ] Document payment troubleshooting steps
- [ ] Create admin guide for handling payment issues
- [ ] Document refund process
- [ ] Create driver payout schedule documentation

---

## 📱 PHASE 7: MOBILE APP VERIFICATION

### Passenger App Testing
- [ ] Test adding Visa/Mastercard
- [ ] Test adding Orange Money phone number
- [ ] Test adding MTN Mobile Money phone number
- [ ] Test setting default payment method
- [ ] Test deleting payment method
- [ ] Test booking ride with card
- [ ] Test booking ride with Orange Money
- [ ] Test booking ride with MTN MoMo
- [ ] Verify payment receipt shows correct details
- [ ] Test payment history screen

### Driver App Testing
- [ ] Test receiving payment notification
- [ ] Test viewing earnings
- [ ] Test payout request
- [ ] Verify payout received in driver account
- [ ] Test transaction history

---

## 🎯 PHASE 8: GO-LIVE

### Final Checks
- [ ] All payment methods tested end-to-end
- [ ] Customer support trained on payment issues
- [ ] Refund policy documented
- [ ] Terms of service updated with payment terms
- [ ] Privacy policy includes payment data handling
- [ ] Contact information added to payment screens

### Launch Preparation
- [ ] Announce payment features to users
- [ ] Offer incentive for first payment (optional)
- [ ] Monitor first 100 transactions closely
- [ ] Respond quickly to any payment issues
- [ ] Gather user feedback

### Post-Launch Monitoring
- [ ] Daily check of payment success rate
- [ ] Monitor webhook delivery rate
- [ ] Check for stuck/pending payments
- [ ] Verify driver payouts processing correctly
- [ ] Review payment gateway fees vs projections

---

## 📊 SUCCESS METRICS

### Week 1 After Launch
- [ ] ≥90% payment success rate
- [ ] <1% failed transactions
- [ ] Zero security incidents
- [ ] <5 customer complaints about payments
- [ ] All driver payouts processed within 24 hours

### Month 1 After Launch
- [ ] ≥95% payment success rate
- [ ] Average transaction time <30 seconds
- [ ] ≥50% of users have saved payment method
- [ ] ≥3 payment methods used (card, Orange, MTN)
- [ ] Payment gateway fees within budget

---

## 🆘 ESCALATION CONTACTS

### If Issues Arise:

**PayStack Issues:**
- Email: support@paystack.com
- Dashboard: https://dashboard.paystack.com
- Check status: https://status.paystack.com

**Orange Money Issues:**
- Contact: Orange Money merchant support (from application)
- Visit: Orange office in Bissau
- Phone: [Get from merchant account]

**MTN MoMo Issues:**
- Email: momo.api.support@mtn.com
- Visit: MTN office in Bissau
- Dashboard: https://momodeveloper.mtn.com

**Technical Issues:**
- Check Railway logs
- Review webhook logs in provider dashboards
- Test in sandbox environment first
- Review `PAYMENT_INTEGRATION_IMPLEMENTATION.md` troubleshooting section

---

## 📅 TIMELINE SUMMARY

| Phase | Duration | Status |
|-------|----------|--------|
| 1. Code Preparation | ✅ Complete | ✅ Done |
| 2. Provider Registration | Week 1-2 | ⏳ Current |
| 3. Backend Configuration | Week 2 | ⏳ Pending |
| 4. Sandbox Testing | Week 3-4 | ⏳ Pending |
| 5. Business Verification | Week 4-6 | ⏳ Pending |
| 6. Production Deployment | Week 6-7 | ⏳ Pending |
| 7. Mobile App Verification | Week 7 | ⏳ Pending |
| 8. Go-Live | Week 8+ | ⏳ Pending |

**Estimated Launch Date:** End of February 2026

---

## ✨ QUICK START (Do This Now!)

### Today's Action Items:

1. ✅ **Contact information complete** (suporte@runrungb.com | +245 955 971 275)
2. **Open `docs/guides/PAYMENT_PROVIDER_EMAILS.md`** - All emails are ready to send!
3. **Send PayStack email** to support@paystack.com and sales@paystack.com
4. **Visit PayStack website** and start signup: https://dashboard.paystack.com/signup
5. **Plan visit to Orange store** in Bissau this week
6. **Plan visit to MTN store** in Bissau this week

### This Week:

7. **Install npm packages:** `cd backend && npm install axios uuid`
8. **Backup old payments.js:** `mv routes/payments.js routes/payments-old.js`
9. **Rename new file:** `mv routes/payments-updated.js routes/payments.js`
10. **Wait for provider responses** (check email daily)

---

## 📝 NOTES

- Keep all provider communications saved (emails, documents)
- Take photos of documents submitted
- Note application reference numbers
- Save all API keys in secure password manager
- Never commit credentials to Git
- Keep backup of .env file securely

---

**Remember:** You're 20% done (code complete)! The next 80% is working with payment providers. Stay patient and persistent! 🚀

---

**Last Updated:** January 6, 2026  
**Next Review:** January 13, 2026 (after provider responses)  
**Contact:** Edivaldo Cardoso | suporte@runrungb.com | +245 955 971 275
