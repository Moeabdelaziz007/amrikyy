#!/bin/bash

set -e

if [ -f .openshift.env ]; then
  export $(grep -v '^#' .openshift.env | xargs -d '\n')
fi

if [ -z "$OPENSHIFT_API_URL" ] || [ -z "$OPENSHIFT_TOKEN" ]; then
  echo "❌ يرجى ضبط OPENSHIFT_API_URL و OPENSHIFT_TOKEN في .openshift.env"
  exit 1
fi

echo "🔐 تسجيل الدخول إلى OpenShift..."
oc login "$OPENSHIFT_API_URL" --token="$OPENSHIFT_TOKEN" --insecure-skip-tls-verify=true | cat

if [ -n "$OPENSHIFT_PROJECT" ]; then
  echo "🧭 استخدام المشروع: $OPENSHIFT_PROJECT"
  oc new-project "$OPENSHIFT_PROJECT" 2>/dev/null || oc project "$OPENSHIFT_PROJECT"
fi

echo "🚀 نشر الموارد..."
oc apply -f k8s-manifests/ | cat

echo "⏳ انتظار الجاهزية..."
oc wait --for=condition=available deployment --all --timeout=180s | cat

echo "✅ تم النشر بنجاح"
