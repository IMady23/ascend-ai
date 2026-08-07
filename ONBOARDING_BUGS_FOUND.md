# Onboarding Critical Bugs - Real User Testing Results

## Testing Context
- Date: User testing session
- Tester: Product owner (Madhav)
- Result: **Multiple critical bugs found**

---

## 🔴 CRITICAL BUGS (Blocking Production)

### 1. Step12 Showing All Zeros
**Status:** IN PROGRESS  
**Severity:** CRITICAL  
**Impact:** Users see "0 kcal, 0g protein, 0 days" instead of their calculated plan

**Console Evidence:**
```
[Step12Review] Input data: Object
[Step12Review] Calculated targets: Object
```

**Root Cause:** Unknown - need expanded console logs to diagnose
- Calculations ARE running (logs appear)
- But UI shows zeros
- Either calculation returns 0 or rendering is broken

**Next Steps:**
1. Expand console "Object" to see actual values
2. If calculations are correct, it's a CountUp animation bug
3. If calculations return 0, it's a data flow bug

---

### 2. Motivation Field Causing Firestore Error
**Status:** ✅ FIXED  
**Severity:** CRITICAL  
**Impact:** Onboarding completion fails, user cannot proceed to dashboard

**Error:**
```
FirebaseError: Function setDoc() called with invalid data. 
Unsupported field value: undefined (found in field profile.motivation)
```

**Root Cause:** Setting `motivation: undefined` instead of omitting the field

**Fix Applied:**
```typescript
// Before (WRONG):
motivation: data.whyStarted ? { whyStarted } : undefined

// After (CORRECT):
if (data.whyStarted && data.whyStarted.trim()) {
  newProfile.motivation = { whyStarted: data.whyStarted.trim() };
}
```

---

### 3. New User Onboarding Starts at Step 12
**Status:** ✅ FIXED  
**Severity:** CRITICAL  
**Impact:** New users skip entire onboarding, see zeros, complete without entering data

**Root Cause:** Draft localStorage keys were not user-specific
- User A completes onboarding (draft saved with step 12)
- User B logs in
- User B loads User A's draft from localStorage
- User B starts at step 12 with empty data

**Fix Applied:**
- Implemented user-specific draft keys: `ascend-onboarding-draft-v2-{userId}`
- All draft functions now accept optional `userId` parameter
- Onboarding page passes `userId` when loading/saving drafts

---

### 4. Dashboard React Hooks Error
**Status:** ✅ FIXED  
**Severity:** CRITICAL  
**Impact:** Dashboard crashes after onboarding completion

**Error:**
```
Error: Rendered fewer hooks than expected. 
This may be caused by an accidental early return statement.
```

**Root Cause:** `useGoalHaptics` hook called AFTER early return
```typescript
// Before (WRONG):
if (!profile) return null; // Early return
useGoalHaptics([...]); // Hook called conditionally - BREAKS REACT RULES

// After (CORRECT):
useGoalHaptics([...]); // Hook called before any returns
if (!profile) return null;
```

---

## ⚠️ HIGH PRIORITY BUGS (Usability Issues)

### 5. Font Contrast Issues in Dark Theme
**Status:** NOT FIXED  
**Severity:** HIGH  
**Impact:** Text barely readable (dark gray on black background)

**Affected Screens:**
- Step12 Review (card labels)
- Step1 Name input labels
- All coach messages

**Expected:**
- Dark theme: White or light gray text
- Light theme: Black or dark gray text

**Actual:**
- Dark theme: Dark gray text (unreadable)

**Why CSS Variables Aren't Working:**
- Variables ARE defined correctly in `globals.css`
- Components ARE using `text-[var(--color-text-primary)]`
- Issue might be: theme switcher not applying `data-theme="dark"` attribute

---

### 6. Target Weight Input Shows Garbled Text
**Status:** ✅ FIXED  
**Severity:** HIGH  
**Impact:** User sees "88888888666666" instead of clean number input

**Fix Applied:**
- Changed from `type="number"` to `type="text"` with `inputMode="decimal"`
- Added input validation to allow only numbers and one decimal point
- Added placeholder text for better UX

---

### 7. Dashboard Showing Default Values Instead of Onboarding Data
**Status:** IN PROGRESS  
**Severity:** HIGH  
**Impact:** After completing onboarding, dashboard shows "0/2097 calories" instead of user's actual targets

**Console Evidence:**
```
[Dashboard] Profile loaded: Object
```

**Need to verify:**
1. Is profile.preferences.goals populated?
2. Are the calculated targets being saved correctly?
3. Is the dashboard reading from the correct path?

---

## 📝 FEATURE GAPS (User Expectations Not Met)

### 8. Missing Baseline Activity Inputs
**Status:** NOT IMPLEMENTED  
**Severity:** MEDIUM  
**Impact:** Users cannot set their CURRENT daily habits, only future goals

**User Expected:**
- "How many steps do you walk daily NOW?"
- "How much water do you drink daily NOW?"
- "How many calories do you eat daily NOW?"

**Currently:**
- Onboarding only asks for goals (target weight, workout days)
- Defaults are hardcoded (10000 steps, 3L water, 2000 cal)
- No way for user to input their baseline

**Solution:**
Add new onboarding screen after Step11 (before preferences):
- Current daily steps input
- Current daily water intake input
- Current daily calorie intake (optional, can estimate)

---

### 9. No Calorie Burn Calculation/Display
**Status:** NOT IMPLEMENTED  
**Severity:** MEDIUM  
**Impact:** Users don't see how workouts affect their calorie budget

**User Expected:**
- Log workout → see "You burned 350 calories"
- Dashboard shows: "2000 cal budget + 350 burned = 2350 available"
- Real-time calorie balance

**Currently:**
- Workouts are logged but don't affect calorie display
- No calorie burn calculation
- No dynamic budget adjustment

---

### 10. Missing kg/lbs Unit Toggle on Inputs
**Status:** NOT IMPLEMENTED  
**Severity:** LOW  
**Impact:** Users must rely on Step11 unit choice, cannot see both units

**User Expected:**
- Step3 (Your Body): See weight in BOTH kg and lbs with toggle
- Step5 (Goal): See target weight in BOTH units

**Currently:**
- Units determined by Step11 choice (metric/imperial)
- No visual toggle during input
- No real-time conversion display

---

## 🎨 POLISH ISSUES (Nice to Have)

### 11. Onboarding Flow Not Smooth
**Status:** NOT FIXED  
**Severity:** LOW  
**Impact:** Animations feel janky, transitions abrupt

**User Feedback:**
"I don't feel the onboarding very smooth, it still needs refinement"

**Needs:**
- Better page transitions between steps
- Smoother coach message animations
- Loading states between heavy screens (Step4 Analyzing)

---

### 12. UI Inconsistency Across Screens
**Status:** NOT FIXED  
**Severity:** LOW  
**Impact:** Different screens have different padding, spacing, input styles

**Observation:**
- Step1 (Name) looks polished
- Step5 (Goal) cards look different
- Step12 (Review) cards use different sizing

**Solution:**
Standardize across all screens:
- Same padding (px-4, py-4)
- Same input styles
- Same button styles
- Same typography hierarchy

---

## 📊 Testing Checklist (Still Needed)

### Manual Testing Required:
- [ ] Complete full onboarding as fresh user
- [ ] Verify Step12 shows real numbers (not zeros)
- [ ] Verify dashboard shows onboarding data correctly
- [ ] Test in both light and dark themes
- [ ] Test on mobile, tablet, desktop
- [ ] Test draft recovery (close mid-flow, reopen)
- [ ] Test completion persistence (refresh, logout/login)
- [ ] Test with different goals (lose fat, gain muscle, maintain, recomp)

---

## 🔧 Fixes Applied This Session

1. ✅ User-specific draft keys (prevents cross-user draft pollution)
2. ✅ Fixed React hooks order (dashboard no longer crashes)
3. ✅ Fixed Firestore motivation field error
4. ✅ Fixed target weight input (no more garbled text)
5. ✅ Added debug logging to Step12 and Dashboard

---

## 🚨 Top Priority Next Steps

1. **Diagnose Step12 zeros** - Expand console logs to see actual calculated values
2. **Fix font contrast** - Verify theme switcher is working, check CSS variable resolution
3. **Verify dashboard sync** - Expand dashboard console log to see what profile data it receives
4. **Add baseline inputs** - New screen for current daily habits (if user wants this feature)
5. **Manual testing** - Complete full flow and verify all data flows correctly

---

**Last Updated:** Current session  
**Status:** Critical bugs partially fixed, some still in progress
