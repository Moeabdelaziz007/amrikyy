#!/bin/bash
# validate_all_fixes.sh - Validate all debugging fixes

set -e

echo "🔍 Validating All Debugging Fixes"
echo "================================="

# Create validation results directory
mkdir -p logs/validation

# Initialize validation results
echo "Validation Results - $(date)" > logs/validation/results.md
echo "=========================" >> logs/validation/results.md

VALIDATION_PASSED=0
VALIDATION_FAILED=0

# Function to log validation result
log_validation() {
    local test_name="$1"
    local status="$2"
    local details="$3"
    
    if [ "$status" = "PASS" ]; then
        echo "✅ $test_name: PASSED" | tee -a logs/validation/results.md
        ((VALIDATION_PASSED++))
    else
        echo "❌ $test_name: FAILED" | tee -a logs/validation/results.md
        echo "   Details: $details" | tee -a logs/validation/results.md
        ((VALIDATION_FAILED++))
    fi
}

# 1. TypeScript Compilation Validation
echo ""
echo "🔍 Validating TypeScript Compilation..."
if npx tsc --noEmit 2>&1 | tee logs/validation/typescript_validation.log; then
    log_validation "TypeScript Compilation" "PASS" "All TypeScript files compile successfully"
else
    log_validation "TypeScript Compilation" "FAIL" "TypeScript compilation errors found (see logs/validation/typescript_validation.log)"
fi

# 2. Linter Validation
echo ""
echo "🔍 Validating Linter..."
if npx eslint . --ext .ts,.tsx 2>&1 | tee logs/validation/linter_validation.log; then
    log_validation "Linter" "PASS" "All linter checks passed"
else
    # Count remaining linter errors
    ERROR_COUNT=$(grep -c "error" logs/validation/linter_validation.log || echo "0")
    log_validation "Linter" "FAIL" "$ERROR_COUNT linter errors remaining"
fi

# 3. Security Audit Validation
echo ""
echo "🔍 Validating Security Audit..."
if npm audit --audit-level=moderate 2>&1 | tee logs/validation/security_validation.log; then
    log_validation "Security Audit" "PASS" "No security vulnerabilities found"
else
    VULNERABILITY_COUNT=$(grep -c "vulnerabilities" logs/validation/security_validation.log || echo "0")
    log_validation "Security Audit" "FAIL" "$VULNERABILITY_COUNT security vulnerabilities found"
fi

# 4. Build Process Validation
echo ""
echo "🔍 Validating Build Process..."
if npm run build 2>&1 | tee logs/validation/build_validation.log; then
    log_validation "Build Process" "PASS" "Build completed successfully"
else
    log_validation "Build Process" "FAIL" "Build process failed (see logs/validation/build_validation.log)"
fi

# 5. Accessibility Validation
echo ""
echo "🔍 Validating Accessibility..."
ACCESSIBILITY_ISSUES=0

# Check for buttons without titles
if find . -name "*.tsx" -o -name "*.html" | xargs grep -l "<button[^>]*>" | xargs grep -L "title=" > /dev/null 2>&1; then
    ((ACCESSIBILITY_ISSUES++))
fi

# Check for selects without accessible names
if find . -name "*.tsx" -o -name "*.html" | xargs grep -l "<select[^>]*>" | xargs grep -L "title=\|aria-label=" > /dev/null 2>&1; then
    ((ACCESSIBILITY_ISSUES++))
fi

# Check for inputs without labels
if find . -name "*.tsx" -o -name "*.html" | xargs grep -l "<input[^>]*>" | xargs grep -L "aria-label=\|title=" > /dev/null 2>&1; then
    ((ACCESSIBILITY_ISSUES++))
fi

# Check for images without alt text
if find . -name "*.tsx" -o -name "*.html" | xargs grep -l "<img[^>]*>" | xargs grep -L "alt=" > /dev/null 2>&1; then
    ((ACCESSIBILITY_ISSUES++))
fi

if [ $ACCESSIBILITY_ISSUES -eq 0 ]; then
    log_validation "Accessibility" "PASS" "All accessibility checks passed"
else
    log_validation "Accessibility" "FAIL" "$ACCESSIBILITY_ISSUES accessibility issues found"
fi

# 6. Performance Validation
echo ""
echo "🔍 Validating Performance..."
PERFORMANCE_ISSUES=0

# Check for inline styles
INLINE_STYLES=$(find . -name "*.tsx" -o -name "*.jsx" | xargs grep -l "style={{.*}}" 2>/dev/null | wc -l)
if [ $INLINE_STYLES -gt 0 ]; then
    ((PERFORMANCE_ISSUES++))
fi

# Check for unused variables
UNUSED_VARS=$(npx eslint . --ext .ts,.tsx --rule "no-unused-vars: error" 2>&1 | grep -c "no-unused-vars" || echo "0")
if [ $UNUSED_VARS -gt 0 ]; then
    ((PERFORMANCE_ISSUES++))
fi

if [ $PERFORMANCE_ISSUES -eq 0 ]; then
    log_validation "Performance" "PASS" "No performance issues found"
else
    log_validation "Performance" "FAIL" "$PERFORMANCE_ISSUES performance issues found"
fi

# 7. Dependency Validation
echo ""
echo "🔍 Validating Dependencies..."
DEPENDENCY_ISSUES=0

# Check for missing dependencies
if ! npm list isomorphic-dompurify > /dev/null 2>&1; then
    ((DEPENDENCY_ISSUES++))
fi

if ! npm list validator > /dev/null 2>&1; then
    ((DEPENDENCY_ISSUES++))
fi

if [ $DEPENDENCY_ISSUES -eq 0 ]; then
    log_validation "Dependencies" "PASS" "All required dependencies installed"
else
    log_validation "Dependencies" "FAIL" "$DEPENDENCY_ISSUES missing dependencies"
fi

# 8. Module Export Validation
echo ""
echo "🔍 Validating Module Exports..."
EXPORT_ISSUES=0

PAGES=(
    "client/src/pages/mcp-tools.tsx"
    "client/src/pages/prompt-library.tsx"
    "client/src/pages/analytics.tsx"
    "client/src/pages/settings.tsx"
    "client/src/pages/not-found.tsx"
    "client/src/pages/DebugView.tsx"
    "client/src/pages/Workspace.tsx"
)

for page in "${PAGES[@]}"; do
    if [ -f "$page" ] && ! grep -q "export default" "$page"; then
        ((EXPORT_ISSUES++))
    fi
done

if [ $EXPORT_ISSUES -eq 0 ]; then
    log_validation "Module Exports" "PASS" "All pages have default exports"
else
    log_validation "Module Exports" "FAIL" "$EXPORT_ISSUES pages missing default exports"
fi

# 9. Database Schema Validation
echo ""
echo "🔍 Validating Database Schema..."
if [ -f "server/api/automation/database.ts" ]; then
    # Check if database connection works
    if node -e "
        const { checkDatabaseHealth } = require('./server/api/automation/database.ts');
        checkDatabaseHealth().then(result => {
            if (result) {
                console.log('Database connection successful');
                process.exit(0);
            } else {
                console.log('Database connection failed');
                process.exit(1);
            }
        }).catch(err => {
            console.log('Database validation error:', err.message);
            process.exit(1);
        });
    " 2>&1 | tee logs/validation/database_validation.log; then
        log_validation "Database Schema" "PASS" "Database connection successful"
    else
        log_validation "Database Schema" "FAIL" "Database connection failed"
    fi
else
    log_validation "Database Schema" "FAIL" "Database configuration file not found"
fi

# 10. CLI Validation
echo ""
echo "🔍 Validating CLI..."
if [ -f "cli.ts" ]; then
    # Check for syntax errors
    if npx tsc --noEmit cli.ts 2>&1 | tee logs/validation/cli_validation.log; then
        log_validation "CLI" "PASS" "CLI syntax is valid"
    else
        log_validation "CLI" "FAIL" "CLI has syntax errors"
    fi
else
    log_validation "CLI" "FAIL" "CLI file not found"
fi

# Generate Summary Report
echo ""
echo "📊 Validation Summary"
echo "==================="

# Add summary to results file
echo "" >> logs/validation/results.md
echo "## Summary" >> logs/validation/results.md
echo "- **Total Tests:** $((VALIDATION_PASSED + VALIDATION_FAILED))" >> logs/validation/results.md
echo "- **Passed:** $VALIDATION_PASSED" >> logs/validation/results.md
echo "- **Failed:** $VALIDATION_FAILED" >> logs/validation/results.md
echo "- **Success Rate:** $(( (VALIDATION_PASSED * 100) / (VALIDATION_PASSED + VALIDATION_FAILED) ))%" >> logs/validation/results.md

echo "Total Tests: $((VALIDATION_PASSED + VALIDATION_FAILED))"
echo "Passed: $VALIDATION_PASSED"
echo "Failed: $VALIDATION_FAILED"
echo "Success Rate: $(( (VALIDATION_PASSED * 100) / (VALIDATION_PASSED + VALIDATION_FAILED) ))%"

# Determine overall status
if [ $VALIDATION_FAILED -eq 0 ]; then
    echo ""
    echo "🎉 All validations passed! Debugging process completed successfully."
    echo "================================================================"
    exit 0
else
    echo ""
    echo "⚠️  Some validations failed. Review the logs and fix remaining issues."
    echo "====================================================================="
    echo ""
    echo "Failed validations:"
    grep "FAILED" logs/validation/results.md | sed 's/^/  /'
    echo ""
    echo "Next steps:"
    echo "1. Review logs in logs/validation/ directory"
    echo "2. Fix remaining issues"
    echo "3. Re-run this validation script"
    echo "4. Check logs/validation/results.md for detailed results"
    exit 1
fi
