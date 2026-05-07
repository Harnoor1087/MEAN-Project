# Testing Guide - AI Resume Intelligence

## 🧪 Complete Testing Checklist

### Prerequisites
- [ ] MongoDB is running
- [ ] Python backend is running on port 8000
- [ ] Node frontend is running on port 3000
- [ ] Browser is open at http://localhost:3000

---

## Test Scenario 1: Admin Registration & Job Creation

### Step 1: Register as Admin
1. Go to http://localhost:3000
2. Click **"Register"** or **"Post Jobs (Company)"**
3. Fill in:
   - Name: `Tech Corp`
   - Email: `admin@techcorp.com`
   - Password: `admin123`
   - Role: Select **"Company/Admin"**
   - Company: `Tech Corp Inc.`
4. Click **"Register"**
5. ✅ Should redirect to `/admin` dashboard

### Step 2: Create First Job
1. Click **"Create Job"** tab
2. Fill in:
   - Title: `Senior Python Developer`
   - Description: `We are looking for an experienced Python developer with ML expertise`
   - Mandatory Skills: `Python, Machine Learning, Django`
   - Optional Skills: `Docker, AWS, Kubernetes`
   - Check **"Enable Certification Scoring"**
   - Certification Weight: `0.3`
3. Click **"Create Job"**
4. ✅ Should see success message
5. ✅ Job should appear in "Job Listings" tab

### Step 3: Create Second Job
1. Create another job:
   - Title: `Frontend Developer`
   - Description: `React developer needed for modern web applications`
   - Mandatory Skills: `React, JavaScript, HTML, CSS`
   - Optional Skills: `TypeScript, Redux, Next.js`
2. ✅ Should have 2 jobs now

### Step 4: Edit Job
1. Go to "Job Listings" tab
2. Click **"Edit"** on first job
3. Change description
4. Add a skill
5. Click **"Update Job"**
6. ✅ Changes should be saved

### Step 5: Logout
1. Click **"Logout"**
2. ✅ Should redirect to login page

---

## Test Scenario 2: Applicant Registration & Job Application

### Step 1: Register as Applicant
1. Go to http://localhost:3000
2. Click **"Register"** or **"Apply for Jobs"**
3. Fill in:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `john123`
   - Role: Select **"Job Applicant"**
4. Click **"Register"**
5. ✅ Should redirect to `/applicant` dashboard

### Step 2: Browse Jobs
1. Should see "Browse Jobs" tab active
2. ✅ Should see both jobs created by admin
3. ✅ Job IDs should be visible
4. ✅ Skills should be displayed with tags

### Step 3: Apply for Job (WITH DISCLAIMER)
1. Click **"Apply Now"** on "Senior Python Developer"
2. ✅ **IMPORTANT: Check the disclaimer box**
   - Should see yellow warning box
   - Job ID should be highlighted
   - Job Title should be shown
3. Note the Job ID: `_____`
4. Fill in:
   - Name: (pre-filled) `John Doe`
   - Email: (pre-filled) `john@example.com`
   - Upload Resume: Select a PDF file
   - Upload Certificates: (Optional) Select PDF files
5. ✅ Check the confirmation checkbox: "I have noted the Job ID"
6. Click **"Submit Application"**
7. ✅ Should see success message with scores
8. ✅ Should auto-redirect to "My Applications" tab

### Step 4: View Application Status
1. Go to "My Applications" tab
2. ✅ Should see submitted application
3. ✅ Should see:
   - Job title and ID
   - Application date
   - Status badge (pending/reviewed/accepted/rejected)
   - AI Scores (Final, Semantic, Skills, Experience)
   - Category
   - Eligibility status

### Step 5: Apply for Second Job
1. Go back to "Browse Jobs"
2. Apply for "Frontend Developer"
3. ✅ Again note the Job ID
4. Upload resume
5. Submit
6. ✅ Should have 2 applications now

### Step 6: Logout
1. Click **"Logout"**
2. ✅ Should redirect to login page

---

## Test Scenario 3: Admin Reviews Applications

### Step 1: Login as Admin
1. Go to http://localhost:3000/login
2. Login with:
   - Email: `admin@techcorp.com`
   - Password: `admin123`
3. ✅ Should redirect to admin dashboard

### Step 2: View Applications
1. Click **"Applications"** tab
2. ✅ Should see both applications from John Doe
3. ✅ Should see:
   - Applicant name and email
   - Job title and ID
   - Application date
   - Status badge
   - AI Scores breakdown
   - Category and eligibility

### Step 3: Update Application Status
1. Find first application
2. Change status dropdown to **"Reviewed"**
3. ✅ Should see success message
4. ✅ Status badge should update

### Step 4: Accept/Reject Applications
1. Change one application to **"Accepted"**
2. Change another to **"Rejected"**
3. ✅ Status badges should update with colors:
   - Pending: Yellow
   - Reviewed: Blue
   - Accepted: Green
   - Rejected: Red

---

## Test Scenario 4: Applicant Checks Updated Status

### Step 1: Login as Applicant
1. Logout from admin
2. Login as `john@example.com`
3. Go to "My Applications"
4. ✅ Should see updated statuses from admin

---

## Test Scenario 5: Edge Cases & Validation

### Test 1: Login with Wrong Password
1. Try to login with wrong password
2. ✅ Should show error message

### Test 2: Register with Existing Email
1. Try to register with `john@example.com` again
2. ✅ Should show "User already exists" error

### Test 3: Apply Without Resume
1. Try to apply without uploading resume
2. ✅ Should show validation error

### Test 4: Apply Without Confirming Job ID
1. Try to apply without checking the Job ID checkbox
2. ✅ Should show error: "Please confirm that you have noted the Job ID"

### Test 5: Upload Non-PDF File
1. Try to upload a .docx or .txt file
2. ✅ Should show error or reject file

### Test 6: Admin Access Control
1. Logout and login as applicant
2. Try to access http://localhost:3000/admin directly
3. ✅ Should redirect to login or show access denied

### Test 7: Delete Job (Admin)
1. Login as admin
2. Try to delete a job
3. ✅ Should ask for confirmation
4. ✅ Job should be deleted

---

## Test Scenario 6: Backend API Testing

### Test Backend Health
```bash
curl http://localhost:8000/
```
✅ Should return: `{"message":"Resume Intelligence API Running"}`

### Test Get Jobs
```bash
curl http://localhost:8000/jobs
```
✅ Should return JSON with jobs list

### Test Get Single Job
```bash
curl http://localhost:8000/job/1
```
✅ Should return job details

---

## Test Scenario 7: UI/UX Testing

### Responsive Design
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on:
   - [ ] Mobile (375px)
   - [ ] Tablet (768px)
   - [ ] Desktop (1920px)
4. ✅ All elements should be readable and functional

### Browser Compatibility
Test on:
- [ ] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] Safari (if available)

### Navigation
1. Test all navigation links
2. Test back button
3. Test logout from different pages
4. ✅ All should work smoothly

---

## Test Scenario 8: AI Scoring Verification

### Create Test Resume
Create a PDF resume with:
- Name at top
- Skills: Python, Machine Learning, Django, Docker
- Experience: 3+ years
- Education section

### Apply and Check Scores
1. Apply for Python Developer job
2. Check scores:
   - ✅ Semantic Score: Should be > 50% if resume matches description
   - ✅ Skill Score: Should be high if mandatory skills present
   - ✅ Experience Score: Based on years
   - ✅ Final Score: Weighted average

### Test with Certificates
1. Create a PDF certificate (any PDF)
2. Upload with resume
3. ✅ Should see certification score if enabled

---

## Test Scenario 9: Data Persistence

### Test 1: Refresh Page
1. Create a job
2. Refresh page
3. ✅ Job should still be there

### Test 2: Logout and Login
1. Create jobs and applications
2. Logout
3. Login again
4. ✅ All data should persist

### Test 3: Restart Servers
1. Stop both servers
2. Restart them
3. Login
4. ✅ All data should still be there

---

## Test Scenario 10: Error Handling

### Test 1: Backend Down
1. Stop Python backend
2. Try to browse jobs
3. ✅ Should show error message gracefully

### Test 2: MongoDB Down
1. Stop MongoDB
2. Try to login
3. ✅ Should show connection error

### Test 3: Invalid Job ID
1. Try to access `/job/999999`
2. ✅ Should show "Job not found"

---

## 📊 Testing Checklist Summary

### Core Features
- [ ] Admin registration
- [ ] Applicant registration
- [ ] Login/Logout
- [ ] Create job
- [ ] Edit job
- [ ] Delete job
- [ ] Browse jobs
- [ ] Apply for job
- [ ] Upload resume
- [ ] Upload certificates
- [ ] View applications (admin)
- [ ] Update application status
- [ ] View my applications (applicant)
- [ ] Job ID disclaimer shown
- [ ] AI scores displayed

### Validation & Security
- [ ] Password validation
- [ ] Email validation
- [ ] File type validation
- [ ] Role-based access control
- [ ] JWT authentication
- [ ] Protected routes

### UI/UX
- [ ] Responsive design
- [ ] Smooth navigation
- [ ] Error messages
- [ ] Success messages
- [ ] Loading states
- [ ] Form validation

### Data & Persistence
- [ ] Data saves correctly
- [ ] Data persists after refresh
- [ ] Data persists after logout
- [ ] Database queries work

---

## 🐛 Common Issues & Solutions

### Issue: "Module not found" error
**Solution:** Run `npm install` in frontend folder

### Issue: "spaCy model not found"
**Solution:** Run the spaCy model installation command

### Issue: "MongoDB connection failed"
**Solution:** Start MongoDB with `mongod`

### Issue: "Port already in use"
**Solution:** Kill process on that port or use different port

### Issue: "CORS error"
**Solution:** Check CORS configuration in backend

### Issue: "File upload fails"
**Solution:** Check uploads folder exists and has permissions

---

## ✅ Final Verification

Before submission, verify:
- [ ] All features work end-to-end
- [ ] No console errors
- [ ] All commits pushed to GitHub
- [ ] README is complete
- [ ] Screenshots taken
- [ ] Demo data prepared
- [ ] Presentation ready

---

**Testing Complete! Ready for Submission! 🎉**
