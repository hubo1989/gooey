### src/components/Settings.tsx

| 类型 | 行号 | 模式内容              | 完整行                                                                         |
| ---- | ---- | --------------------- | ------------------------------------------------------------------------------ |
| text | 5    | Settings              | `<h1 className="text-3xl font-bold tracking-tight">`Settings`</h1>`        |
| text | 6    | General Settings      | `<p className="mt-1 text-sm text-muted-foreground">`General Settings`</p>` |
| text | 12   | Custom Theme Colors   | `<h3 className="text-lg font-semibold mb-4">`Custom Theme Colors`</h3>`    |
| text | 13   | Permission Rules      | `<h3 className="text-lg font-semibold mb-4">`Permission Rules`</h3>`       |
| text | 14   | Allow Rules           | `<h3 className="text-lg font-semibold mb-4">`Allow Rules`</h3>`            |
| text | 15   | Deny Rules            | `<h3 className="text-lg font-semibold mb-4">`Deny Rules`</h3>`             |
| text | 16   | Environment Variables | `<h3 className="text-lg font-semibold mb-4">`Environment Variables`</h3>`  |
| text | 17   | Advanced Settings     | `<h3 className="text-lg font-semibold mb-4">`Advanced Settings`</h3>`      |
| text | 18   | User Hooks            | `<h3 className="text-lg font-semibold mb-4">`User Hooks`</h3>`             |
| text | 19   | Manual Only           | `<p className="text-sm text-muted-foreground">`Manual Only`</p>`           |
| text | 20   | After Each Prompt     | `<p className="text-sm text-muted-foreground">`After Each Prompt`</p>`     |
| text | 21   | After Tool Use        | `<p className="text-sm text-muted-foreground">`After Tool Use`</p>`        |
| text | 22   | Smart (Recommended)   | `<p className="text-sm text-muted-foreground">`Smart (Recommended)`</p>`   |

### src/components/CheckpointSettings.tsx

| 类型 | 行号 | 模式内容                                | 完整行                                                                                                       |
| ---- | ---- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| text | 146  | Checkpoint Settings                     | `<h1 className="text-3xl font-bold tracking-tight">`Checkpoint Settings`</h1>`                           |
| text | 147  | Manage session checkpoints and recovery | `<p className="text-caption text-muted-foreground mt-0.5">`Manage session checkpoints and recovery`</p>` |
| text | 157  | Experimental Feature                    | `<p className="text-caption font-medium text-amber-900 dark:text-amber-100">`Experimental Feature`</p>`  |
| text | 195  | Automatic Checkpoints                   | `<Label htmlFor="auto-checkpoint" className="text-label">`Automatic Checkpoints`</Label>`                |
| text | 210  | Checkpoint Strategy                     | `<Label htmlFor="strategy" className="text-label">`Checkpoint Strategy`</Label>`                         |
| text | 257  | Storage Management                      | `<Label className="text-label">`Storage Management`</Label>`                                             |
| text | 267  | Keep Recent Checkpoints                 | `<Label htmlFor="keep-count" className="text-label">`Keep Recent Checkpoints`</Label>`                   |

### src/components/Agents.tsx

| 类型 | 行号 | 模式内容         | 完整行                                                                   |
| ---- | ---- | ---------------- | ------------------------------------------------------------------------ |
| text | 201  | Agents           | `<h1 className="text-3xl font-bold tracking-tight">`Agents`</h1>`    |
| text | 281  | Delete Agent     | `<h3 className="text-lg font-semibold mb-4">`Delete Agent`</h3>`     |
| text | 326  | No Agents Yet    | `<h3 className="text-lg font-semibold mb-2">`No Agents Yet`</h3>`    |
| text | 403  | No Agent History | `<h3 className="text-lg font-semibold mb-2">`No Agent History`</h3>` |
| text | 436  | Started:         | `<span className="text-muted-foreground">`Started:                     |
| text | 440  | Duration:        | `<span className="text-muted-foreground">`Duration:                    |
| text | 444  | Tokens:          | `<span className="text-muted-foreground">`Tokens:                      |

### src/components/AgentExecution.tsx

| 类型 | 行号 | 模式内容                                                           | 完整行                                                                                                                                    |
| ---- | ---- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| text | 622  | Model Selection                                                    | `<Label className="text-caption text-muted-foreground">`Model Selection`</Label>`                                                     |
| text | 649  | Faster, efficient                                                  | `<div className="text-caption text-muted-foreground">`Faster, efficient`</div>`                                                       |
| text | 679  | More capable                                                       | `<div className="text-caption text-muted-foreground">`More capable`</div>`                                                            |
| text | 689  | Task Description                                                   | `<Label className="text-caption text-muted-foreground">`Task Description`</Label>`                                                    |
| text | 699  | Configure Hooks                                                    | `<span className="text-caption">`Configure Hooks                                                                                        |
| text | 771  | Ready to Execute                                                   | `<h3 className="text-lg font-medium mb-2">`Ready to Execute`</h3>`                                                                    |
| text | 782  | Initializing agent...                                              | `<span className="text-sm text-muted-foreground">`Initializing agent...                                                                 |
| text | 835  | {agent.name} - Output                                              | `<h2 className="text-lg font-semibold">`{agent.name} - Output`</h2>`                                                                  |
| text | 839  | Running                                                            | `<span className="text-xs text-green-600 font-medium">`Running                                                                          |
| text | 912  | Ready to Execute                                                   | `<h3 className="text-lg font-medium mb-2">`Ready to Execute`</h3>`                                                                    |
| text | 923  | Initializing agent...                                              | `<span className="text-sm text-muted-foreground">`Initializing agent...                                                                 |
| text | 968  | Configure Hooks                                                    | `<DialogTitle className="text-heading-2">`Configure Hooks`</DialogTitle>`                                                             |
| text | 991  | shared across all users of this project. Local hooks are stored in | shared across all users of this project. Local hooks are stored in                                                                        |
| text | 992  | .claude/local_settings.json and only apply to your                 | `<code className="font-mono text-xs bg-background px-1.5 py-0.5 rounded">`.claude/local_settings.json`</code>` and only apply to your |
| text | 993  | current session.                                                   | current session.                                                                                                                          |

### src/components/AgentExecutionDemo.tsx

| 类型 | 行号 | 模式内容             | 完整行                                                                    |
| ---- | ---- | -------------------- | ------------------------------------------------------------------------- |
| text | 174  | Agent Execution Demo | `<h1 className="text-2xl font-bold mb-6">`Agent Execution Demo`</h1>` |

### src/components/AgentRunOutputViewer.tsx

| 类型 | 行号 | 模式内容             | 完整行                                                                |
| ---- | ---- | -------------------- | --------------------------------------------------------------------- |
| text | 538  | Loading agent run... | `<p className="text-muted-foreground">`Loading agent run...`</p>` |
| text | 560  | Running              | `<span className="text-xs text-green-600 font-medium">`Running      |

### src/components/AgentRunsList.tsx

| 类型 | 行号 | 模式内容                 | 完整行                                                           |
| ---- | ---- | ------------------------ | ---------------------------------------------------------------- |
| text | 94   | No execution history yet | `<p className="text-sm">`No execution history yet`</p>`      |
| text | 136  | Running                  | `<span className="text-xs text-green-600 font-medium">`Running |

### src/components/AgentRunView.tsx

| 类型 | 行号 | 模式内容          | 完整行                                                                     |
| ---- | ---- | ----------------- | -------------------------------------------------------------------------- |
| text | 265  | Execution History | `<p className="text-xs text-muted-foreground">`Execution History`</p>` |
| text | 327  | Task:             | `<h3 className="text-sm font-medium">`Task:`</h3>`                     |
