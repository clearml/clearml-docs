---
title: MongoDB Chart Migration Guide
---

This guide provides a comprehensive procedure for migrating MongoDB from the Bitnami Helm chart to the MongoDB Kubernetes Operator (MCK) with zero data loss and minimal downtime for ClearML chart versions 10.11.6 and earlier.

This migration procedure ensures a smooth transition from Bitnami MongoDB to MCK MongoDB with minimal service disruption. The phased approach allows for thorough testing at each stage, reducing the risk of production issues.

## Prerequisites

Export your `clearml namespace` (the default is `clearml` but verify your actual namespace as it may have been customized during installation):

```bash
CLEARML_NAMESPACE=clearml
```

## System Requirements

- **Current Version**: Confirm you are running ClearML Enterprise version 10.11.6 ( `helm -n $CLEARML_NAMESPACE list` )
- **Pre-migration Update**: Upgrade to version 10.11.7 without modifying any custom values

## Procedure

### Phase 1: Enable MCK MongoDB Deployment

Add CRDs following Helm chart README:

```bash
kubectl apply -f https://raw.githubusercontent.com/mongodb/mongodb-kubernetes/1.6.1/public/crds.yaml
```

Update your Helm chart configuration with the following values to deploy the MCK MongoDB instance, staying on Helm chart version `10.11.7`:

```yaml
mckMongodb:
  enabled: true
```

Upgrade chart accordingly with helm upgrade command.

:::note
This step creates the new MongoDB instance in parallel with the existing Bitnami deployment, allowing for data migration without service interruption.
:::

### Phase 2: Data Migration Process

#### 2.1 Scale down the ClearML API server

Scale down ClearML Enterprise services:

```bash
kubectl -n $CLEARML_NAMESPACE scale deployment -l app.kubernetes.io/name=clearml-enterprise --replicas=0
```

#### 2.2 Deploy Migration Pod

Create a Kubernetes pod equipped with MongoDB tools for the migration process. Create a file called `mongodb-migrate.yaml`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mongodb-migrate
spec:
  restartPolicy: Never
  containers:
    - name: mongo-tools
      image: mongo:7
      command: ["sleep", "infinity"]
      env:
        - name: CLEARML_MONGODB_SERVICE_CONNECTION_STRING
          valueFrom:
            secretKeyRef:
              name: mongodb-root
              key: connectionString
```

Deploy and access the migration pod:

```bash
kubectl -n $CLEARML_NAMESPACE apply -f mongodb-migrate.yaml
```

#### 2.3 Export Data from Source Database

Dump data from Bitnami MongoDB:

```bash
MONGO_CONNECTION_STRING=$(kubectl get deploy -n $CLEARML_NAMESPACE -o jsonpath='{.items[*].spec.template.spec.containers[?(@.name=="clearml-apiserver")].env[?(@.name=="CLEARML_MONGODB_SERVICE_CONNECTION_STRING")].value}{"\n"}')
kubectl -n $CLEARML_NAMESPACE exec -it mongodb-migrate -- mongodump --uri="$MONGO_CONNECTION_STRING" --archive=/dump.archive --gzip
```

Copy the dump to a local system so there's a further local copy just in case:

```bash
kubectl -n $CLEARML_NAMESPACE cp mongodb-migrate:/dump.archive /tmp/dump.archive
```

#### 2.4 Import Data to Target Database

Restore data to MCK MongoDB:

```bash
kubectl -n $CLEARML_NAMESPACE exec -it mongodb-migrate -- sh -c 'mongorestore \
  --uri="$CLEARML_MONGODB_SERVICE_CONNECTION_STRING" \
  --archive=/dump.archive \
  --gzip \
  --drop'
```

### Phase 3: Configuration Updates

#### 3.1 Mark Migration as Complete

Update your Helm configuration to indicate successful data migration, staying on Helm chart version 10.11.7:

```yaml
mckMongodb:
  enabled: true
  migrated: true
```

Upgrade chart accordingly with helm upgrade command.

#### 3.2 Validate System Functionality

Thoroughly test ClearML Enterprise functionality to ensure all components are working correctly with the new MongoDB deployment.

#### 3.3 Decommission Bitnami MongoDB

Once validation is complete, disable the legacy Bitnami MongoDB deployment, staying on Helm chart version 10.11.7:

```yaml
mongodb:
  enabled: false
mckMongodb:
  enabled: true
  migrated: true
```

Upgrade chart accordingly with helm upgrade command.

#### 3.4 Remove migration pod

Remove the migration pod:

```bash
kubectl -n $CLEARML_NAMESPACE delete -f mongodb-migrate.yaml
```