# 🚀 DocumentDB for VS Code

<p align="center">

<strong>A powerful, open-source GUI for DocumentDB and MongoDB API databases.</strong>

</p>

<p align="center">

  <img src="https://img.shields.io/badge/VS%20Code-Extension-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white" alt="VS Code"/>
  <img src="https://img.shields.io/badge/DocumentDB-MongoDB%20API-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="DocumentDB"/>
  <img src="https://img.shields.io/badge/MongoDB-Compatible-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Open%20Source-Community-181717?style=for-the-badge&logo=github&logoColor=white" alt="Open Source"/>

</p>

<p align="center">

<a href="#-overview">Overview</a> • <a href="#-features">Features</a> • <a href="#-query-your-data">Query</a> • <a href="#-connect-anywhere">Connections</a> • <a href="#-data-management">Data Management</a> • <a href="#-indexes">Indexes</a>

</p>

---

# 🌍 Overview

**DocumentDB for VS Code** is an open-source database management extension designed for working with **DocumentDB and MongoDB API-compatible databases directly inside Visual Studio Code**.

The extension provides an integrated environment for **browsing, querying, analyzing, and managing database data** without requiring external database GUI applications.

Because DocumentDB supports the **MongoDB API wire protocol**, the extension can work with a wide range of MongoDB API databases, including:

* 📦 DocumentDB
* ☁️ Azure DocumentDB
* ☁️ AWS DocumentDB
* 🌐 Azure Cosmos DB for MongoDB (RU)
* 🍃 MongoDB Atlas
* 🖥️ Self-hosted MongoDB API instances
* 🧪 Local MongoDB API emulators

Everything runs directly inside VS Code, allowing developers to connect to their databases, explore collections, execute queries, manage documents, and work with indexes from a single development environment.

> **Vision:** Provide developers with a unified database development experience where querying, administration, and application development can happen inside VS Code.

---

# ✨ Key Features

## 🔎 Query Your Data, Your Way

DocumentDB for VS Code provides **three integrated query surfaces** for interacting with database data:

```text
                    Database
                       │
                       ▼
              ┌──────────────────┐
              │ DocumentDB for   │
              │     VS Code      │
              └────────┬─────────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
   Collection View  Query       Interactive
                    Playground    Shell
          │            │            │
          └────────────┼────────────┘
                       ▼
                  Query Results
```

All three surfaces share **schema awareness** and navigation actions, allowing developers to move between visual queries, JavaScript scripts, and shell-based workflows.

---

# 🧩 Collection View

The **Collection View** provides a visual query interface for filtering, projecting, and sorting collection data.

As you work with a collection, the editor can provide suggestions based on the actual data in the collection.

### Capabilities

* 🔍 Schema-aware field suggestions
* 🧬 BSON type indicators
* ⚡ Type-aware operator ordering
* 📝 Filter editor
* 📋 Project editor
* ↕️ Sort editor
* 💡 Context-aware value suggestions
* 📚 Operator documentation on hover
* 🚨 Real-time validation
* 🛠️ Typo detection

### Query Intelligence

The query editor understands different field types and adjusts suggestions accordingly.

For example:

```text
Number Field
     │
     ├── Comparison Operators
     ├── Range Operators
     └── Numeric Values

String Field
     │
     ├── Regex Operators
     ├── String Operators
     └── String Values
```

### Relaxed Query Syntax

Collection View supports convenient query syntax including:

* Unquoted keys
* Single quotes
* BSON constructors
* `ObjectId()`
* `ISODate()`
* JavaScript expressions

It also provides dedicated completions for:

```text
Project
  1 → Include field
  0 → Exclude field

Sort
  1  → Ascending
 -1  → Descending
```

---

# 🧪 Query Playground

The **Query Playground** allows developers to write and execute JavaScript database scripts directly inside VS Code.

Scripts use the:

```text
.documentdb.js
```

file format.

Each script block can be executed independently using **CodeLens** controls.

### Features

* ▶️ Run individual script blocks
* ▶️ Run all scripts
* 💻 Full JavaScript syntax
* ✨ Autocompletion
* 🔗 `db.*` chain completion
* 📚 Collection method suggestions
* 🧬 Schema field suggestions
* 🖨️ `console.log()` support
* 🖨️ `print()` support
* 🖨️ `printjson()` support
* 📊 Dedicated result panel

### Multi-Connection Workflows

Multiple Query Playground files can remain open simultaneously.

Each playground can be connected to a different database server.

```text
Playground 1
     │
     ▼
Database A


Playground 2
     │
     ▼
Database B


Playground 3
     │
     ▼
Database C
```

Queries can also be opened directly in:

* Collection View
* Interactive Shell

---

# 💻 Interactive Shell

The **Interactive Shell** provides a REPL-style database environment directly inside VS Code.

Common database commands can be executed without leaving the editor.

### Supported Shell Features

* `show dbs`
* `use <db>`
* `help`
* `it`
* Persistent variables
* Syntax highlighting
* Tab completion
* Ghost text suggestions
* Context-aware database suggestions
* Collection completion
* Method completion
* Operator completion
* Field completion

### Smart Completion

The shell understands the current database context and can suggest:

```text
Database
   │
   ▼
Collection
   │
   ▼
Method
   │
   ▼
Operator
   │
   ▼
Field
```

Long-running operations can also be cancelled using:

```text
Ctrl + C
```

Results include clickable navigation links that can open the corresponding collection in Collection View or Query Playground.

---

# ⚡ Zero-Install Runtime

The Query Playground and Interactive Shell require **no external database shell installation**.

The runtime is bundled directly into the extension.

### Benefits

* 🚫 No external shell executable
* 🚫 No PATH configuration
* 🚫 No shell version mismatches
* 🔐 Entra ID authentication support
* 🪟 Windows support
* 🍎 macOS support
* 🐧 Linux support

The runtime reuses the database connection already established by the extension.

### Privacy

Schema information used for autocompletion is collected locally from the documents that you browse and query.

> **No database data is sent to external services for schema-aware completion.**

---

# 🌐 Connect Anywhere

DocumentDB for VS Code supports databases that communicate through the **MongoDB API wire protocol**.

```text
                 DocumentDB for VS Code
                          │
             ┌────────────┼────────────┐
             │            │            │
             ▼            ▼            ▼
        Connection    Service       Local
          String      Discovery    Environment
             │            │            │
             ▼            ▼            ▼
        MongoDB API-Compatible Databases
```

### Connection Methods

* 🔗 Connection strings
* ☁️ Azure Service Discovery
* 🍃 MongoDB Atlas Service Discovery
* ☸️ Kubernetes Service Discovery
* 🖥️ Local DocumentDB
* 🧪 Local MongoDB API instances
* 🌐 Azure Cosmos DB Emulator

---

# 🔗 Connection Strings

Connect to a database by providing its connection string.

```text
Connection String
        │
        ▼
DocumentDB for VS Code
        │
        ▼
MongoDB API Wire Protocol
        │
        ▼
Database
```

This provides a direct workflow for connecting to supported MongoDB API-compatible databases.

---

# ☁️ Azure Service Discovery

The extension can discover and connect to Azure-hosted database resources directly from the VS Code sidebar.

Supported resources include:

* Azure DocumentDB
* Azure Cosmos DB for MongoDB (RU)
* DocumentDB running on Azure VMs

### Entra ID Authentication

Azure-hosted databases support **Entra ID authentication** with:

* Multi-account support
* Multi-tenant support

---

# 📁 Connection Organization

Connections can be organized into folders and subfolders.

Example:

```text
Connections
│
├── Production
│   ├── DocumentDB
│   └── Cosmos DB
│
├── Development
│   ├── Local
│   └── Staging
│
└── Kubernetes
    ├── AKS
    └── Local Cluster
```

This makes it easier to manage multiple environments and database connections.

---

# 🖥️ DocumentDB Local

DocumentDB for VS Code provides guided setup for a local **DocumentDB** instance.

The extension can:

1. Pull the official DocumentDB image
2. Create a persistent Docker volume
3. Generate credentials
4. Select an available port
5. Wait for database readiness
6. Save the connection automatically

### Local Setup Workflow

```text
DocumentDB Local
       │
       ▼
Pull Official Image
       │
       ▼
Create Persistent Volume
       │
       ▼
Generate Credentials
       │
       ▼
Select Available Port
       │
       ▼
Wait for Database
       │
       ▼
Save Connection
       │
       ▼
Ready to Use
```

### Local Management

From the VS Code connection tree, developers can:

* ▶️ Start the instance
* ⏹️ Stop the instance
* 🔄 Restart the instance
* 🗑️ Delete the instance

The extension keeps the displayed state synchronized with Docker.

### Docker Support

DocumentDB Local works with:

* Docker Engine
* Docker Desktop

The extension does **not** install Docker or elevate system privileges.

---

# 🧪 Local Database Support

In addition to DocumentDB Local, the extension can connect to:

* Azure Cosmos DB Emulator
* Local MongoDB API instances
* Other databases compatible with the MongoDB API

For detailed local setup, refer to the official **Set up DocumentDB Local** documentation.

---

# 🍃 MongoDB Atlas Service Discovery

DocumentDB for VS Code can discover MongoDB Atlas resources directly from the sidebar.

Developers can browse:

```text
Atlas Organization
        │
        ▼
Projects
        │
        ▼
Clusters
        │
        ▼
Saved Database Connection
```

### Atlas Features

* 🔐 API Key authentication
* 🔐 Service Account authentication
* 🏢 Multiple organization credentials
* 🌳 Hierarchical tree view
* 📋 Flat cluster list
* 🟡 Cluster state labels
* 🔗 Open directly in MongoDB Atlas

Atlas discovery credentials are used to locate resources.

Database access continues to use the configured Atlas database username and password.

---

# ☸️ Kubernetes Service Discovery

DocumentDB for VS Code can discover DocumentDB clusters running across Kubernetes environments.

Supported environments include:

* Amazon EKS
* Azure AKS
* Google GKE
* kind
* minikube
* Docker Desktop

### Kubernetes Workflow

```text
Kubeconfig
    │
    ▼
Kubernetes Context
    │
    ▼
DocumentDB Cluster Discovery
    │
    ▼
Service Discovery
    │
    ▼
Port-Forward Tunnel
    │
    ▼
Database Connection
```

### Kubernetes Features

* Multiple kubeconfig sources
* Default kubeconfig support
* File-based kubeconfig
* Pasted YAML configuration
* DocumentDB Kubernetes Operator recognition
* Annotated service discovery
* Automatic port-forwarding
* Automatic tunnel restoration
* Connectivity status labels
* Custom Kubernetes context names
* List and tree layouts

---

# 📊 Browse and Manage Data

DocumentDB for VS Code provides multiple ways to inspect and manage database documents.

## Data Views

Collections can be viewed using:

| View      | Purpose                                   |
| --------- | ----------------------------------------- |
| **Table** | Structured tabular representation         |
| **Tree**  | Hierarchical document exploration         |
| **JSON**  | Raw JSON-oriented document representation |

Built-in pagination makes it easier to navigate through larger collections.

---

# 📝 Document Management

Documents can be managed directly from VS Code.

Supported operations include:

* ➕ Create documents
* ✏️ Edit documents
* 🗑️ Delete documents
* 🔍 Browse documents
* 📄 Inspect document structures

This allows developers to perform common database management tasks without switching to an external GUI.

---

# 📥 Import and Export

DocumentDB for VS Code supports data movement through JSON files.

### Import

```text
JSON File
    │
    ▼
DocumentDB for VS Code
    │
    ▼
Collection
```

### Export

Developers can export:

* Documents
* Query results
* Entire collections

---

# 📋 Collection Copy and Paste

Collections can be copied and pasted between databases or servers.

```text
Source Database
      │
      ▼
Collection
      │
      │ Copy
      ▼
DocumentDB for VS Code
      │
      │ Paste
      ▼
Target Database
```

Conflict resolution strategies can be used when existing data creates conflicts during the operation.

---

# 📑 Manage Indexes

The **Indexes** tab in Collection View brings index management directly alongside the queries affected by those indexes.

Developers can:

* 🔍 Review existing indexes
* ➕ Create required indexes
* 🗑️ Remove unnecessary indexes

The goal is to keep index management close to the collection and query workflow.

```text
Collection
    │
    ├── Documents
    ├── Queries
    └── Indexes
          │
          ├── Review
          ├── Create
          └── Remove
```

---

# 🏗️ Integrated Database Workflow

DocumentDB for VS Code brings the primary database development workflow into a single environment.

```text
                 VS Code
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
   Collection    Query      Interactive
     View       Playground     Shell
        │           │           │
        └───────────┼───────────┘
                    │
                    ▼
             Database Access
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
      Browse      Query       Manage
        │           │           │
        └───────────┼───────────┘
                    ▼
             Database Results
```

---

# 🔄 End-to-End Data Workflow

```text
Connect to Database
        │
        ▼
Discover Database
        │
        ▼
Select Database
        │
        ▼
Select Collection
        │
        ▼
┌──────────────────────────┐
│      Work With Data      │
├──────────────────────────┤
│ Collection View          │
│ Query Playground         │
│ Interactive Shell        │
└────────────┬─────────────┘
             │
             ▼
      Query / Browse Data
             │
             ▼
      Manage Documents
             │
             ▼
       Manage Indexes
             │
             ▼
       Import / Export
```

---

# 🛠️ Technology & Platform

## Database Compatibility

| Technology           | Purpose                            |
| -------------------- | ---------------------------------- |
| **DocumentDB**       | Document database platform         |
| **MongoDB API**      | Database communication protocol    |
| **MongoDB Atlas**    | Cloud database discovery           |
| **Azure DocumentDB** | Azure-hosted database              |
| **Azure Cosmos DB**  | MongoDB API database               |
| **AWS DocumentDB**   | Cloud document database            |
| **Kubernetes**       | Cluster discovery and connectivity |
| **Docker**           | Local DocumentDB environments      |

## Development Environment

| Technology             | Purpose                            |
| ---------------------- | ---------------------------------- |
| **Visual Studio Code** | Integrated development environment |
| **JavaScript**         | Query Playground scripting         |
| **Docker**             | Local DocumentDB runtime           |
| **MongoDB API**        | Database communication             |
| **BSON**               | Document and query data types      |

---

# 🔐 Authentication & Security

DocumentDB for VS Code supports authentication workflows for supported database environments.

### Authentication Capabilities

* Connection-string authentication
* Entra ID authentication
* Azure multi-account authentication
* Azure multi-tenant authentication
* MongoDB Atlas API Key authentication
* MongoDB Atlas Service Account authentication

Atlas discovery credentials are used for resource discovery, while database access uses the configured database credentials.

---

# 🔒 Privacy

Schema information used for query autocompletion is gathered locally from the documents that developers browse and query.

The extension does not send this schema information to external services for autocompletion.

> **Your database development workflow stays inside VS Code.**

---

# 📚 Documentation

Detailed documentation is available for specific workflows, including:

### DocumentDB Local

See the **Set up DocumentDB Local** guide for local installation and configuration.

### MongoDB Atlas

See the **MongoDB Atlas Service Discovery** guide for Atlas organizations, projects, clusters, and credentials.

### Kubernetes

See the **Kubernetes Service Discovery** guide for Kubernetes-based DocumentDB cluster discovery and connectivity.

---

# 🌟 Project Highlights

```text
┌──────────────────────────────────────────────┐
│            DOCUMENTDB FOR VS CODE            │
├──────────────────────────────────────────────┤
│                                              │
│        🔎 Collection View                   │
│                    +                         │
│        🧪 Query Playground                  │
│                    +                         │
│        💻 Interactive Shell                 │
│                    +                         │
│        🌐 Multi-Cloud Connectivity          │
│                    +                         │
│        📊 Data Management                   │
│                    +                         │
│        📑 Index Management                  │
│                                              │
│                    =                         │
│                                              │
│       COMPLETE DATABASE WORKFLOW             │
│             INSIDE VS CODE                   │
│                                              │
└──────────────────────────────────────────────┘
```

---

# 💡 Why DocumentDB for VS Code?

Modern developers frequently switch between their code editor, database GUI, terminal, cloud console, and infrastructure tools.

DocumentDB for VS Code brings many of these database workflows directly into the development environment.

Instead of switching applications:

```text
Traditional Workflow

VS Code
   ↓
Database GUI
   ↓
Terminal
   ↓
Cloud Console
   ↓
Kubernetes CLI
```

The extension provides an integrated workflow:

```text
                VS Code
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
      Query      Browse     Manage
        │          │          │
        └──────────┼──────────┘
                   ▼
             Database
```

This makes database exploration, querying, document management, local development, cloud discovery, and index administration accessible from one environment.

---

# 🌍 Supported Database Ecosystem

```text
                 DocumentDB
                      │
                      ▼
             MongoDB API Protocol
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
     Azure           AWS         MongoDB
   DocumentDB     DocumentDB      Atlas
        │             │             │
        └─────────────┼─────────────┘
                      │
              ┌───────┼────────┐
              ▼       ▼        ▼
           Cosmos   Self-Hosted Local
            DB       Instances  Emulators
```

---

# 📌 Summary

**DocumentDB for VS Code** provides a complete database development experience for databases that support the MongoDB API wire protocol.

Its core capabilities include:

* 🔎 Schema-aware Collection View
* 🧪 JavaScript Query Playground
* 💻 Integrated Interactive Shell
* ⚡ Zero-install query runtime
* ☁️ Azure Service Discovery
* 🍃 MongoDB Atlas Service Discovery
* ☸️ Kubernetes Service Discovery
* 🖥️ Local DocumentDB setup
* 📊 Table, Tree, and JSON data views
* 📝 Document creation, editing, and deletion
* 📥 JSON import and export
* 📋 Collection copy and paste
* 📑 Index management
* 🔐 Entra ID authentication
* 📁 Connection folders and subfolders

> **One editor. One workflow. Your database.**

---

# 📄 License

DocumentDB for VS Code is an **open-source project**.

Refer to the project's official repository for licensing information and contribution guidelines.

---

# 🌟 Final Takeaway

DocumentDB for VS Code turns **Visual Studio Code into an integrated workspace for MongoDB API-compatible databases**, combining database browsing, querying, scripting, shell access, cloud discovery, local development, document management, and index administration.

```text
                  CODE
                   +
                 QUERY
                   +
                DATABASE
                   +
              INFRASTRUCTURE
                   │
                   ▼
          PRODUCTIVE DEVELOPMENT
             INSIDE VS CODE
```

**Build. Query. Explore. Manage. All from VS Code. 🚀**
