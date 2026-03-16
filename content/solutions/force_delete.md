
CRD with finalizer can't be deleted due to missing webhook
kubectl patch crd llminferenceservices.serving.kserve.io --type=json -p='[{"op": "remove", "path": "/metadata/finalizers"}]'


