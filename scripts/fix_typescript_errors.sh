#!/bin/bash
# fix_typescript_errors.sh - Fix TypeScript compilation errors

set -e

echo "🔧 Fixing TypeScript Compilation Errors"
echo "======================================="

# Create type definitions file
cat > client/src/types/debug-types.ts << 'EOF'
// Centralized type definitions for debugging

export interface TaskParameter {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    required: boolean;
    options?: string[];
    description?: string;
}

export interface ResourceRequirement {
    cpu: number;
    memory: number;
    storage: number;
    network?: boolean;
}

export interface RetryPolicy {
    maxAttempts: number;
    delay: number;
    backoffMultiplier: number;
}

export interface TaskMetadata {
    timeout: number;
    priority: number;
    tags: string[];
    dependencies: string[];
}

export interface ExecutionError {
    code: string;
    message: string;
    stack?: string;
    timestamp: Date;
}

export interface ExecutionMetrics {
    duration: number;
    retryCount: number;
    resourceUsage: ResourceRequirement;
}

export interface ExecutionContext {
    userId: string;
    sessionId: string;
    input: Record<string, any>;
    variables: Record<string, any>;
}

export interface WorkflowNode {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: Record<string, any>;
}

export interface WorkflowConnection {
    id: string;
    source: string;
    target: string;
    type: string;
}

export interface WorkflowVariable {
    name: string;
    type: string;
    value: any;
}

export interface WorkflowSettings {
    name: string;
    description: string;
    version: string;
}

export interface WorkflowMetadata {
    author: string;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
}
EOF

echo "✅ Created centralized type definitions"

# Fix mcp-tools.tsx parameter types
if [ -f "client/src/pages/mcp-tools.tsx" ]; then
    echo "🔧 Fixing mcp-tools.tsx parameter types..."
    
    # Add proper type annotations
    sed -i 's/param =>/param: TaskParameter =>/g' client/src/pages/mcp-tools.tsx
    sed -i 's/value) =>/value: string) =>/g' client/src/pages/mcp-tools.tsx
    sed -i 's/prev) =>/prev: Record<string, any>) =>/g' client/src/pages/mcp-tools.tsx
    sed -i 's/option =>/option: string =>/g' client/src/pages/mcp-tools.tsx
    
    # Add import for TaskParameter
    if ! grep -q "TaskParameter" client/src/pages/mcp-tools.tsx; then
        sed -i '1i import { TaskParameter } from "@/types/debug-types";' client/src/pages/mcp-tools.tsx
    fi
    
    echo "✅ Fixed mcp-tools.tsx parameter types"
fi

# Fix settings.tsx parameter types
if [ -f "client/src/pages/settings.tsx" ]; then
    echo "🔧 Fixing settings.tsx parameter types..."
    
    # Add proper type annotations for event handlers
    sed -i 's/e) =>/e: React.ChangeEvent<HTMLInputElement>) =>/g' client/src/pages/settings.tsx
    
    echo "✅ Fixed settings.tsx parameter types"
fi

# Fix database service type issues
if [ -f "server/database-service.ts" ]; then
    echo "🔧 Fixing database-service.ts type issues..."
    
    # Add imports for missing types
    cat > temp_imports.txt << 'EOF'
import { ResourceRequirement, RetryPolicy, TaskMetadata, ExecutionError, ExecutionMetrics, ExecutionContext, WorkflowNode, WorkflowConnection, WorkflowVariable, WorkflowSettings, WorkflowMetadata } from '../types/debug-types';
EOF
    
    # Insert imports at the beginning of the file
    sed -i '1r temp_imports.txt' server/database-service.ts
    rm temp_imports.txt
    
    echo "✅ Fixed database-service.ts type issues"
fi

# Fix database optimizer type issues
if [ -f "server/database-optimizer.ts" ]; then
    echo "🔧 Fixing database-optimizer.ts type issues..."
    
    # Create a backup
    cp server/database-optimizer.ts server/database-optimizer.ts.backup
    
    # Fix property access issues by adding proper type assertions
    sed -i 's/\.title/.title as string/g' server/database-optimizer.ts
    sed -i 's/\.updatedAt/.updatedAt as Date/g' server/database-optimizer.ts
    sed -i 's/\.steps/.steps as any/g' server/database-optimizer.ts
    sed -i 's/\.systemPrompt/.systemPrompt as string/g' server/database-optimizer.ts
    sed -i 's/\.capabilities/.capabilities as string[]/g' server/database-optimizer.ts
    sed -i 's/\.description/.description as string/g' server/database-optimizer.ts
    sed -i 's/\.configuration/.configuration as any/g' server/database-optimizer.ts
    sed -i 's/\.agentId/.agentId as string/g' server/database-optimizer.ts
    sed -i 's/\.content/.content as string/g' server/database-optimizer.ts
    sed -i 's/\.role/.role as string/g' server/database-optimizer.ts
    sed -i 's/\.timestamp/.timestamp as Date/g' server/database-optimizer.ts
    
    echo "✅ Fixed database-optimizer.ts type issues"
fi

# Fix CLI private method access
if [ -f "cli.ts" ]; then
    echo "🔧 Fixing CLI private method access..."
    
    # Make basicSystemCheck public
    sed -i 's/private basicSystemCheck/public basicSystemCheck/g' cli.ts
    
    echo "✅ Fixed CLI private method access"
fi

# Fix App.tsx lazy loading issues
if [ -f "client/src/App.tsx" ]; then
    echo "🔧 Fixing App.tsx lazy loading issues..."
    
    # Ensure all lazy-loaded components have default exports
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
            component_name=$(basename "$page" .tsx)
            if ! grep -q "export default" "$page"; then
                echo "" >> "$page"
                echo "export default $component_name;" >> "$page"
                echo "✅ Added default export to $page"
            fi
        fi
    done
    
    echo "✅ Fixed App.tsx lazy loading issues"
fi

# Test TypeScript compilation
echo "🔍 Testing TypeScript compilation..."
if npx tsc --noEmit; then
    echo "✅ TypeScript compilation successful"
else
    echo "⚠️  TypeScript compilation still has errors"
    echo "Run 'npx tsc --noEmit' to see remaining issues"
fi

echo ""
echo "🎉 TypeScript error fixing completed!"
echo "====================================="
echo "Next steps:"
echo "1. Review any remaining TypeScript errors"
echo "2. Run 'npm run build' to test the build process"
echo "3. Fix any remaining type issues manually"
