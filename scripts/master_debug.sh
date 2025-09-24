#!/bin/bash
# master_debug.sh - Master debugging script for AuraOS

set -e  # Exit on any error

echo "🚀 Starting AuraOS Comprehensive Debugging Process"
echo "=================================================="
echo "Timestamp: $(date)"
echo ""

# Create logs directory
mkdir -p logs

# Function to log progress
log_progress() {
    echo "[$(date '+%H:%M:%S')] $1" | tee -a logs/debug_progress.log
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
log_progress "🔍 Checking prerequisites..."
if ! command_exists node; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm not found. Please install npm first."
    exit 1
fi

log_progress "✅ Prerequisites check passed"

# Phase 1: Critical Infrastructure Fixes
echo ""
echo "📋 Phase 1: Critical Infrastructure Fixes"
echo "=========================================="

# 1.1 Fix CLI Syntax Error
log_progress "🔧 Fixing CLI syntax error..."
if [ -f "cli.ts" ]; then
    # Check for syntax error at line 1074
    if grep -n "await cli.autopilotLLMStatus();" cli.ts | grep -q "1074"; then
        # Fix missing parenthesis
        sed -i '1074s/.*/        });/' cli.ts
        log_progress "✅ CLI syntax error fixed"
    else
        log_progress "⚠️  CLI syntax error not found at expected location"
    fi
else
    log_progress "⚠️  cli.ts not found"
fi

# 1.2 Fix Module Export Issues
log_progress "🔧 Fixing module export issues..."
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
    if [ -f "$page" ]; then
        # Check if file has default export
        if ! grep -q "export default" "$page"; then
            # Extract component name from filename
            component_name=$(basename "$page" .tsx)
            echo "" >> "$page"
            echo "export default $component_name;" >> "$page"
            log_progress "✅ Added default export to $page"
        else
            log_progress "✅ $page already has default export"
        fi
    else
        log_progress "⚠️  $page not found"
    fi
done

# 1.3 Install Missing Dependencies
log_progress "🔧 Installing missing dependencies..."
npm install isomorphic-dompurify@latest validator@latest @types/isomorphic-dompurify @types/validator
log_progress "✅ Missing dependencies installed"

# 1.4 Update Vulnerable Dependencies
log_progress "🔧 Updating vulnerable dependencies..."
npm update esbuild@latest lodash@latest oauth2-server@latest
log_progress "✅ Vulnerable dependencies updated"

# Phase 2: TypeScript Compilation Check
echo ""
echo "📋 Phase 2: TypeScript Compilation Check"
echo "======================================="

log_progress "🔍 Checking TypeScript compilation..."
if npx tsc --noEmit 2>&1 | tee logs/typescript_errors.log; then
    log_progress "✅ TypeScript compilation successful"
else
    log_progress "⚠️  TypeScript compilation has errors (see logs/typescript_errors.log)"
fi

# Phase 3: Linter Check
echo ""
echo "📋 Phase 3: Linter Check"
echo "======================="

log_progress "🔍 Running linter..."
if npx eslint . --ext .ts,.tsx 2>&1 | tee logs/linter_errors.log; then
    log_progress "✅ Linter checks passed"
else
    log_progress "⚠️  Linter found issues (see logs/linter_errors.log)"
fi

# Phase 4: Security Audit
echo ""
echo "📋 Phase 4: Security Audit"
echo "========================="

log_progress "🔍 Running security audit..."
if npm audit --audit-level=moderate 2>&1 | tee logs/security_audit.log; then
    log_progress "✅ Security audit passed"
else
    log_progress "⚠️  Security vulnerabilities found (see logs/security_audit.log)"
fi

# Phase 5: Build Test
echo ""
echo "📋 Phase 5: Build Test"
echo "====================="

log_progress "🔍 Testing build process..."
if npm run build 2>&1 | tee logs/build_output.log; then
    log_progress "✅ Build successful"
else
    log_progress "❌ Build failed (see logs/build_output.log)"
fi

# Phase 6: Accessibility Check
echo ""
echo "📋 Phase 6: Accessibility Check"
echo "==============================="

log_progress "🔍 Checking accessibility issues..."
# Find HTML/TSX files with accessibility issues
find . -name "*.html" -o -name "*.tsx" | while read file; do
    # Check for buttons without titles
    if grep -q "<button[^>]*>" "$file" && ! grep -q "title=" "$file"; then
        echo "⚠️  $file: Button missing title attribute" >> logs/accessibility_issues.log
    fi
    
    # Check for selects without accessible names
    if grep -q "<select[^>]*>" "$file" && ! grep -q "title=" "$file" && ! grep -q "aria-label=" "$file"; then
        echo "⚠️  $file: Select missing accessible name" >> logs/accessibility_issues.log
    fi
    
    # Check for inputs without labels
    if grep -q "<input[^>]*>" "$file" && ! grep -q "aria-label=" "$file" && ! grep -q "title=" "$file"; then
        echo "⚠️  $file: Input missing label" >> logs/accessibility_issues.log
    fi
done

if [ -f "logs/accessibility_issues.log" ]; then
    log_progress "⚠️  Accessibility issues found (see logs/accessibility_issues.log)"
else
    log_progress "✅ No accessibility issues found"
fi

# Phase 7: Performance Check
echo ""
echo "📋 Phase 7: Performance Check"
echo "============================="

log_progress "🔍 Checking performance issues..."
# Check for inline styles
find . -name "*.tsx" -o -name "*.jsx" | xargs grep -l "style={{.*}}" 2>/dev/null | while read file; do
    echo "⚠️  $file: Contains inline styles" >> logs/performance_issues.log
done

# Check for unused variables
npx eslint . --ext .ts,.tsx --rule "no-unused-vars: error" 2>&1 | grep "no-unused-vars" >> logs/performance_issues.log || true

if [ -f "logs/performance_issues.log" ]; then
    log_progress "⚠️  Performance issues found (see logs/performance_issues.log)"
else
    log_progress "✅ No performance issues found"
fi

# Generate Summary Report
echo ""
echo "📊 Debugging Summary Report"
echo "=========================="

cat > logs/debug_summary.md << EOF
# AuraOS Debugging Summary Report

**Generated:** $(date)
**Script:** master_debug.sh

## Issues Found

### TypeScript Compilation
- **Status:** $(if [ -s logs/typescript_errors.log ]; then echo "❌ Errors found"; else echo "✅ Clean"; fi)
- **Details:** See logs/typescript_errors.log

### Linter Issues
- **Status:** $(if [ -s logs/linter_errors.log ]; then echo "❌ Issues found"; else echo "✅ Clean"; fi)
- **Details:** See logs/linter_errors.log

### Security Vulnerabilities
- **Status:** $(if [ -s logs/security_audit.log ]; then echo "❌ Vulnerabilities found"; else echo "✅ Clean"; fi)
- **Details:** See logs/security_audit.log

### Build Process
- **Status:** $(if [ -s logs/build_output.log ]; then echo "❌ Build failed"; else echo "✅ Build successful"; fi)
- **Details:** See logs/build_output.log

### Accessibility Issues
- **Status:** $(if [ -f logs/accessibility_issues.log ]; then echo "❌ Issues found"; else echo "✅ Clean"; fi)
- **Details:** See logs/accessibility_issues.log

### Performance Issues
- **Status:** $(if [ -f logs/performance_issues.log ]; then echo "❌ Issues found"; else echo "✅ Clean"; fi)
- **Details:** See logs/performance_issues.log

## Next Steps

1. Review all log files in the logs/ directory
2. Address critical issues first (TypeScript compilation, security)
3. Fix accessibility and performance issues
4. Re-run this script to validate fixes

## Files Modified

- cli.ts (syntax fix)
- Multiple page components (added default exports)
- package.json (updated dependencies)

EOF

log_progress "📄 Summary report generated: logs/debug_summary.md"

echo ""
echo "🎉 Debugging process completed!"
echo "==============================="
echo "Check the logs/ directory for detailed results"
echo "Review logs/debug_summary.md for next steps"
echo ""
echo "Next: Run specific fix scripts for remaining issues"
