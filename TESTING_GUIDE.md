# TennisMeet Testing Guide

## Table of Contents
1. [Testing Overview](#testing-overview)
2. [End-to-End Testing](#end-to-end-testing)
3. [Cross-Browser Testing](#cross-browser-testing)
4. [Mobile Device Testing](#mobile-device-testing)
5. [Performance Testing](#performance-testing)
6. [Accessibility Testing](#accessibility-testing)
7. [Bug Reporting](#bug-reporting)

---

## Testing Overview

### Testing Goals
- Ensure all user flows work seamlessly from start to finish
- Verify cross-browser compatibility (Chrome, Safari, Firefox, Edge)
- Validate mobile responsiveness on iOS and Android devices
- Meet performance benchmarks (< 2 second load times)
- Achieve WCAG 2.1 AA accessibility standards

### Testing Environment Setup

**Prerequisites:**
- Node.js 18+ installed
- npm or yarn package manager
- Modern browsers (Chrome, Safari, Firefox, Edge)
- Mobile devices or browser dev tools for mobile testing

**Local Development:**
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

**Production Build Testing:**
```bash
# Create production build
npm run build

# Start production server
npm start

# Open http://localhost:3000
```

---

## End-to-End Testing

### Critical User Flows

#### 1. Player Discovery Flow
**Objective:** Find and connect with tennis players

**Steps:**
1. Navigate to home page (/)
2. View featured players list
3. Use search/filter options:
   - Search by name
   - Filter by NTRP rating (use slider)
   - Filter by location
   - Filter by playing style
4. Click on a player card to view profile
5. Verify player details display correctly:
   - Name, location, NTRP rating
   - Playing style, bio
   - Match history
   - Availability calendar

**Expected Results:**
- All filters work correctly and update results in real-time
- Search is responsive with debouncing (no lag)
- Player cards display proper information
- Profile page loads with complete details
- No console errors

**Success Criteria:**
✅ Can find players using multiple filter combinations
✅ Search results update within 500ms
✅ Profile pages load within 2 seconds

---

#### 2. Match Scheduling Flow
**Objective:** Schedule a tennis match with another player

**Steps:**
1. From player profile, click "Schedule Match"
2. Fill out match form:
   - Select date (must be future date)
   - Select time
   - Enter location/court
   - Set duration (30-300 minutes)
3. Submit match request
4. Verify success toast notification appears
5. Navigate to matches page (/matches)
6. Verify new match appears in list
7. Click on match to view details
8. Test match actions:
   - Accept/decline match (if recipient)
   - Cancel match (if creator)
   - Complete match and record scores

**Expected Results:**
- Form validation works for all fields
- Cannot select past dates
- Duration must be 30-300 minutes
- Success notification displays
- Match appears in list immediately
- Match status updates correctly

**Success Criteria:**
✅ Form validation prevents invalid submissions
✅ Match appears in both users' match lists
✅ Status changes reflect immediately
✅ Can complete match and record winner

---

#### 3. Availability Management Flow
**Objective:** Set and manage weekly availability

**Steps:**
1. Navigate to availability page (/availability)
2. View current weekly availability calendar
3. Add new availability time blocks:
   - Select day of week
   - Set start time
   - Set end time
   - Save time block
4. Edit existing time blocks:
   - Click edit button
   - Modify times
   - Save changes
5. Delete time blocks:
   - Click delete button
   - Confirm deletion
6. View common availability with another player:
   - Search for player
   - View overlapping time slots highlighted
   - Schedule match during common time

**Expected Results:**
- Calendar displays current week correctly
- Can add multiple time blocks per day
- Time blocks don't overlap
- Changes persist after page reload
- Common availability finder highlights matches

**Success Criteria:**
✅ Can manage full weekly schedule
✅ Time conflicts are prevented
✅ Common availability finder works accurately
✅ Changes save and persist

---

#### 4. Court Discovery Flow
**Objective:** Find and bookmark tennis courts

**Steps:**
1. Navigate to courts page (/courts)
2. Browse court listings
3. Use search and filters:
   - Search by name/location
   - Filter by surface type
   - Filter by rating
4. Click on court card to view details
5. View court information:
   - Name, location, surface
   - Photos, ratings, reviews
   - Amenities
6. Add court to favorites (if implemented)
7. Get directions (external link)

**Expected Results:**
- Courts display with images and details
- Search and filters work smoothly
- Court details page shows complete information
- External links work correctly
- Can bookmark favorite courts

**Success Criteria:**
✅ All courts searchable and filterable
✅ Court details are comprehensive
✅ Maps/directions integration works
✅ User can manage favorite courts

---

#### 5. Profile Management Flow
**Objective:** Create and update user profile

**Steps:**
1. Navigate to profile edit page (/profile/edit)
2. Fill out profile form:
   - First name (required, 2-50 chars)
   - Last name (required, 2-50 chars)
   - Email (required, valid format)
   - Phone (optional, 10-15 digits)
   - Location (required, 3+ chars)
   - NTRP rating (1.0-7.0, 0.5 increments)
   - Playing style (dropdown)
   - Bio (optional, max 500 chars)
3. Test form validation:
   - Try invalid email
   - Try invalid phone format
   - Try invalid NTRP rating
   - Exceed character limits
4. Submit valid form
5. Verify success notification
6. Check profile page updates

**Expected Results:**
- All validation rules enforced
- Clear error messages for invalid inputs
- Character counters for limited fields
- Success message after save
- Profile updates immediately visible

**Success Criteria:**
✅ Cannot submit invalid data
✅ Helpful error messages guide user
✅ Profile saves successfully
✅ Updates reflect immediately

---

### Error Handling Tests

Test error scenarios to ensure graceful handling:

1. **Network Errors:**
   - Disconnect internet during operation
   - Verify error message displays
   - Ensure app doesn't crash

2. **Invalid Data:**
   - Enter malformed data in forms
   - Verify validation catches issues
   - Check error messages are helpful

3. **404 Pages:**
   - Navigate to non-existent routes
   - Verify 404 page displays
   - Can navigate back to home

4. **Empty States:**
   - View pages with no data
   - Verify empty state messages
   - Provides helpful next steps

---

## Cross-Browser Testing

### Target Browsers
- Chrome (latest 2 versions)
- Safari (latest 2 versions)
- Firefox (latest 2 versions)
- Edge (latest 2 versions)

### Browser-Specific Tests

For each browser, verify:

#### Layout and Styling
- ✅ All pages render correctly
- ✅ CSS animations work smoothly
- ✅ Responsive breakpoints work
- ✅ Fonts load properly
- ✅ Images display correctly

#### Functionality
- ✅ All buttons and links work
- ✅ Forms submit successfully
- ✅ Dropdowns and modals function
- ✅ Date pickers work
- ✅ Search and filters operate correctly

#### JavaScript Features
- ✅ No console errors
- ✅ Event handlers work
- ✅ AJAX requests succeed
- ✅ State management functions
- ✅ Routing works properly

### Known Browser Issues
Document any browser-specific quirks here:

**Safari:**
- Date input format may differ
- Test carefully with date pickers

**Firefox:**
- Check slider component styling
- Verify form auto-complete behavior

**Edge:**
- Test all Chromium-based features
- Verify backwards compatibility if supporting older Edge

---

## Mobile Device Testing

### Target Devices
- **iOS:** iPhone 12+, iPad
- **Android:** Samsung Galaxy S21+, Pixel 6+

### Mobile Testing Checklist

#### Responsive Design
- ✅ All pages scale correctly
- ✅ Text is readable without zooming
- ✅ Buttons are tap-friendly (min 44x44px)
- ✅ Navigation menu works on mobile
- ✅ Forms are usable on small screens

#### Touch Interactions
- ✅ Tap targets are appropriately sized
- ✅ Swipe gestures work (if implemented)
- ✅ Scroll behavior is smooth
- ✅ No hover-only interactions
- ✅ Modal and drawer animations work

#### Performance
- ✅ Pages load quickly on 4G/5G
- ✅ Images are optimized for mobile
- ✅ Animations don't cause jank
- ✅ Battery drain is acceptable

#### Mobile-Specific Features
- ✅ Phone number links work (tel:)
- ✅ Address links open maps app
- ✅ Camera access works (if used)
- ✅ Geolocation works (if used)

### Testing with Browser DevTools

**Chrome DevTools:**
1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select device presets or custom dimensions
4. Test different viewports:
   - Mobile: 375x667 (iPhone SE)
   - Tablet: 768x1024 (iPad)
   - Desktop: 1920x1080

**Responsive Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## Performance Testing

### Performance Benchmarks

**Target Metrics:**
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms

### Testing Tools

#### 1. Chrome Lighthouse
```bash
# Open Chrome DevTools
# Navigate to Lighthouse tab
# Run audit for Performance, Accessibility, Best Practices, SEO
# Target: 90+ scores across all categories
```

**Run Lighthouse:**
1. Open page in Chrome
2. Open DevTools (F12)
3. Go to Lighthouse tab
4. Select categories to test
5. Click "Generate report"
6. Review recommendations

#### 2. WebPageTest
- Visit https://www.webpagetest.org
- Enter your site URL
- Select test location and device
- Run test and review waterfall chart
- Check Time to First Byte (TTFB)

#### 3. Chrome Performance Monitor
1. Open DevTools
2. Go to Performance tab
3. Click Record
4. Interact with page
5. Stop recording
6. Analyze frame rate, CPU usage, memory

### Performance Optimization Checklist

- ✅ Images are optimized (WebP, proper sizing)
- ✅ Lazy loading implemented for below-fold content
- ✅ Code splitting for large bundles
- ✅ Debouncing on search inputs
- ✅ Memoization for expensive calculations
- ✅ Virtual scrolling for long lists
- ✅ Minimize render-blocking resources
- ✅ Use production build for testing

---

## Accessibility Testing

### WCAG 2.1 AA Compliance

#### Keyboard Navigation
- ✅ All interactive elements accessible via Tab
- ✅ Focus indicators are visible
- ✅ Skip to content link present
- ✅ Modal focus trap works
- ✅ Escape key closes dialogs
- ✅ Arrow keys work in menus/lists

#### Screen Reader Testing
Test with:
- **macOS:** VoiceOver (Cmd+F5)
- **Windows:** NVDA (free) or JAWS
- **Mobile:** TalkBack (Android), VoiceOver (iOS)

Verify:
- ✅ All images have alt text
- ✅ Form inputs have labels
- ✅ Error messages are announced
- ✅ Dynamic content updates announced
- ✅ Semantic HTML used correctly
- ✅ ARIA attributes used appropriately

#### Color and Contrast
- ✅ Text contrast ratio ≥ 4.5:1 (normal text)
- ✅ Text contrast ratio ≥ 3:1 (large text)
- ✅ Focus indicators have 3:1 contrast
- ✅ Information not conveyed by color alone

#### Automated Testing Tools

**axe DevTools:**
1. Install axe DevTools Chrome extension
2. Open DevTools
3. Go to axe DevTools tab
4. Click "Scan ALL of my page"
5. Review and fix issues

**Wave Browser Extension:**
1. Install Wave extension
2. Click Wave icon on page
3. Review errors and warnings
4. Fix accessibility issues

---

## Bug Reporting

### Bug Report Template

```markdown
## Bug Title
[Clear, concise description]

## Severity
- [ ] Critical (blocks core functionality)
- [ ] High (major feature broken)
- [ ] Medium (minor feature issue)
- [ ] Low (cosmetic or edge case)

## Environment
- **Browser:** Chrome 120.0
- **OS:** macOS 14.1
- **Device:** MacBook Pro
- **Screen Size:** 1920x1080

## Steps to Reproduce
1. Navigate to...
2. Click on...
3. Fill in form with...
4. Observe...

## Expected Behavior
What should happen?

## Actual Behavior
What actually happens?

## Screenshots/Video
[Attach if applicable]

## Console Errors
[Copy any console errors]

## Additional Notes
Any other relevant information
```

### Bug Tracking

Create issues in GitHub with:
- Clear title and description
- Steps to reproduce
- Screenshots or screen recordings
- Browser and device information
- Labels (bug, priority, browser-specific)

---

## Testing Checklist Summary

### Pre-Release Testing

**Functional Testing:**
- [ ] All user flows work end-to-end
- [ ] Forms validate correctly
- [ ] Error handling works gracefully
- [ ] Empty states display properly
- [ ] Loading states show appropriately

**Cross-Browser Testing:**
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)

**Mobile Testing:**
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Responsive design works at all breakpoints
- [ ] Touch interactions are smooth

**Performance Testing:**
- [ ] Lighthouse scores 90+ on all categories
- [ ] Load times under 2 seconds
- [ ] No performance regressions
- [ ] Images optimized
- [ ] Code splitting implemented

**Accessibility Testing:**
- [ ] Keyboard navigation works completely
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG AA
- [ ] ARIA labels correct
- [ ] Focus management proper

**Final Checks:**
- [ ] No console errors in production
- [ ] All external links work
- [ ] 404 page displays correctly
- [ ] Favicon and metadata correct
- [ ] SEO tags in place

---

## Regression Testing

Before each release, run regression tests on:

1. **Core Features:**
   - Player discovery
   - Match scheduling
   - Availability management
   - Profile editing

2. **Critical Paths:**
   - User registration/login (when implemented)
   - Creating matches
   - Updating profiles
   - Searching players/courts

3. **Fixed Bugs:**
   - Re-test previously fixed bugs
   - Ensure fixes didn't introduce new issues

---

## Performance Monitoring

### Production Monitoring
Consider implementing:
- Google Analytics for usage tracking
- Sentry for error tracking
- Vercel Analytics for performance metrics
- User feedback collection

---

## Next Steps

After completing all tests:
1. Document all bugs found
2. Prioritize bugs by severity
3. Fix critical and high-priority bugs
4. Re-test fixed bugs
5. Perform final smoke test
6. Deploy to production with confidence

---

**Testing completed by:** [Name]
**Date:** [Date]
**Version:** [Version number]
**Status:** [ ] Pass / [ ] Fail (with issues documented)
