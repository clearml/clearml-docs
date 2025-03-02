---
title: Reports
---

<div class="vid" >
<iframe style={{position: 'absolute', top: '0', left: '0', bottom: '0', right: '0', width: '100%', height: '100%'}} 
        src="https://www.youtube.com/embed/D6fCvpmV8eo" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
        allowfullscreen>
</iframe>
</div>

<br/>

With ClearML's Reports you can write up notes, task findings, or really anything you want. You can create reports 
in any of your ClearML projects.

In addition to its main document, a report also contains a description field, which will appear in the report's card in 
the [Reports Page](#reports-page). Reports are searchable based on their description, so adding a description 
can make it easier to find the report later. 

Reports are editable Markdown documents, supporting:
* Multi-level headings
* Text formatting: Italics, bold, and strikethrough
* Bulleted and numbered lists
* Tables
* Code blocks
* Text and image hyperlinks
* Embedded images uploaded from your computer
* Embedded ClearML task, model, and [app](applications/apps_overview.md) content

![Report](../img/webapp_report.png#light-mode-only)
![Report](../img/webapp_report_dark.png#dark-mode-only)

Publishing a report locks it for future editing, so you can preserve its contents. You can also share your reports, 
download a PDF copy, or simply copy the MarkDown content and reuse in your editor of choice.

Access ClearML reports through the [Reports Page](#reports-page).

## Embedding ClearML Visualizations
You can embed plots and images from your ClearML objects (tasks, models, and apps) into your reports: scalar 
graphs and other plots, and debug samples 
from an individual object or from an object comparison page. These visualizations are updated live as the 
object(s) updates.

To add a graphic resource: 
1. Go to the resource you want to embed in your report (a plot or debug sample from an individual object or 
object comparison) 
2. Hover over the resource and click <img src="/docs/latest/icons/ico-plotly-embed-code.svg" alt="Generate embed code" className="icon size-md space-sm" />. 
   
   ![Reports step 2](../img/reports_step_2.png#light-mode-only)
   ![Reports step 2](../img/reports_step_2_dark.png#dark-mode-only)

   Click `Embed in ClearML report`. This generates the embed code for accessing the resource, and copies 
   it to your clipboard. 
 
   ![Reports step 2a](../img/reports_step_2a.png#light-mode-only)
   ![Reports step 2a](../img/reports_step_2a_dark.png#dark-mode-only)

3. Return to your report page and paste the code snippet

   ![Reports step 3](../img/reports_step_3.png#light-mode-only)
   ![Reports step 3](../img/reports_step_3_dark.png#dark-mode-only)

Once embedded in the report, you can return to the resource's original location (e.g. comparison page, task/model/app page) 
by clicking <img src="/docs/latest/icons/ico-resource-return.svg" alt="Return to resource" className="icon size-md" />.

### Customizing Embed Code

You can customize embed codes to make more elaborate queries for what you want to display in your reports. 
A standard embed code is formatted like this: 

```
<iframe
  src="<web_server>/widgets/?type=sample&objectType=task&objects=<object_id>&xaxis=iter&metrics=<metric_name>&variants=Plot%20as%20an%20image&company=<company/workspace_id>"
  width="100%" height="400"
></iframe>
```

The `src` parameter is made up of the following components: 
* Your web server's URL (e.g. `app.clear.ml`)
* `/widget/` - The endpoint that serves the embedded data.
* The query parameters for your visualization (the path and query are separated by a question mark `?`)

The query is formatted like a standard query string: `<parameter>=<parameter_value>`. Multiple parameter-value pairs are 
delimited with a `&`: `<parameter_1>=<parameter_value_1>&<parameter_2>=<parameter_value_2>`.

The query string usually includes the following parameters:
* `objectType` - The type of object to fetch. The options are `task` or `model` (`task` also includes ClearML app instances).
* `objects` - Object IDs (i.e. task or model IDs depending on specified ObjectType). Specify multiple IDs like this: 
`objects=<id>&objects=<id>&objects=<id>`. Alternatively, you can input a query, and the matching objects' specified 
resources will be displayed. See [Dynamic Queries](#dynamic-queries) below.
* `type` - The type of resource to fetch. The options are: 
    * `plot`
    * `scalar`
    * `single` (single-scalar values table)
    * `sample` (debug sample)
    * `parcoords` (hyperparameter comparison plots) - for this option, you need to also specify the following parameters:
      * `metrics` - Unique metric/variant ID formatted like `metric_id.variant_id` (see note [below](#event_id)) 
      * `variants` - Parameters to include in the plot (write in following format `<section_name>.<parameter_1>&<section_name>.<parameter_2>`)
      * `value_type` - Specify which metric values to use. The options are:
        * `min_value`
        * `max_value`
        * `value` (last value)
* `xaxis` - Set the x-axis units for plots. The options are:
  * `iter` - Iteration (default)
  * `timestamp` - Time from start
  * `iso_time` - Wall time
* `metrics` - Metric name 
* `variants` - Variant's name
* `company` - Workspace ID. Applicable to the ClearML hosted service, for embedding content from a different workspace 
* `light` - add parameter to switch visualization to light theme

:::tip URL encoding
For strings, make sure to use the appropriate URL encoding. For example, if the metric name is "Metric Name", 
write `Metric%20Name`
:::

### Dynamic Queries
You can create more complex queries by specifying object criteria (e.g. tags, statuses, projects, etc.) instead of 
specific task IDs, with parameters from the [`tasks.get_all`](../references/api/tasks.md#post-tasksget_all) or 
[`models.get_all`](../references/api/models.md#post-modelsget_all) API calls. 

For these parameters, use the following syntax:
* `key=value` for non-array fields
* `key[]=<value1>,<value2>` for array fields. 

Delimit the fields with `&`s. 

#### Examples:

The following are examples of dynamic queries. All the examples use `objectType=task`, but `objectType=model` can also be 
used. 

* Request the scalars plot of a specific metric variant for the latest task in a project:

  ```
  src="<web_server>/widgets/?objectType=task&xaxis=iter&type=scalar&metrics=<metric_name>&variants=<variant>&project=<project_id>&page_size=1&page=0&order_by[]=-last_update
  ```
  Notice that the `project` parameter is specified. To get the most recent single task, 
  `page_size=1&page=0&order_by[]=-last_update` is added. `page_size` specifies how many results are returned in each 
  page, and `page` specifies which page to return (in this case the first page)--this way you can specify how many 
  tasks you want in your graph. `order_by[]=-last_update` orders the results by update time in descending order 
  (most recent first).    
* Request the scalars plot of a specific metric variant for the tasks with a specific tag: 

  ```
  src="<web_server>/widgets/?objectType=task&xaxis=iter&type=scalar&metrics=<metric_name>&variants=<variant>&tags[]=__$or,<tag>
  ```
  A list of tags that the task should contain is specified in the `tags` argument. You can also specify tags that 
  exclude tasks. See tag filter syntax examples [here](../clearml_sdk/task_sdk.md#tag-filters).    
* Request the `training/accuracy` scalar plot of the 5 tasks with the best accuracy scores (see Metric/Variant IDs note [below](#event_id)):

  ```
  src="<web_server>/widgets/?objectType=task&xaxis=iter&type=scalar&metrics=training&variants=accuracy&project=4043a1657f374e9298649c6ba72ad233&page_size=5&page=0&order_by[]=-last_metrics.<metric_id>.<variant_id>.value"
  ```
  
<a id="event_id"></a>

:::tip Metric/Variant IDs
Metric names need to be MD5 encoded for parallel coordinate plots and for ordering query results by metric
performance. You can encode the strings in Python with `hashlib.md5(str("<metric_string>").encode("utf-8")).hexdigest()`,
and use the returned MD5 hash in your query.
:::


   
## Reports Page
Use the Reports Page to navigate between and manage reports. 

You can view the reports page in Project view <img src="/docs/latest/icons/ico-project-view.svg" alt="Project view" className="icon size-md" /> 
or in List view <img src="/docs/latest/icons/ico-flat-view.svg" alt="List view" className="icon size-md" />. In List 
view, all reports are shown side-by-side. In Project view, reports are organized according to their projects, and 
top-level projects are displayed. Click on a project card to view the project's reports.

![Report page](../img/webapp_report_page.png#light-mode-only)
![Report page](../img/webapp_report_page_dark.png#dark-mode-only)

## Project Cards
In Project view, project cards display a project's summarized report information:

<div class="max-w-50">

![Report project card](../img/webapp_report_project_card.png#light-mode-only)
![Report project card](../img/webapp_report_project_card_dark.png#dark-mode-only)

</div>

Click on a project card to view its reports.

### Report Cards

In List view, the report cards display summarized report information:

<div class="max-w-50">

![report card](../img/webapp_report_card.png#light-mode-only)
![report card](../img/webapp_report_card_dark.png#dark-mode-only)

</div>

* Report name
* Report's project
* Creating user
* Last update time
* Status
* Description
* Tags 

#### Report Actions

Click <img src="/docs/latest/icons/ico-bars-menu.svg" alt="Menu" className="icon size-md space-sm" /> on the top right
of a report card to open its context menu and access report actions:  

<div class="max-w-50">

![Report card context menu](../img/webapp_report_card_context_menu.png#light-mode-only)
![Report card context menu](../img/webapp_report_card_context_menu_dark.png#dark-mode-only)

</div>

* **Rename** - Change the report's name
* **Share** - Copy URL to share report
* **Add Tag** - Add labels to the report to help easily classify groups of reports.
* **Move to** - Move the report into another project. If the target project does not exist, it is created on-the-fly.
* **Archive** - Move report from active reports page to archive
* **Delete** - Delete the report. To delete a report, it must first be archived. 

### Create Reports

To create a report, click the **+ NEW REPORT** button in the top right of the page, 
which will open a **New Report** modal.

![New project modal](../img/webapp_report_new_report.png#light-mode-only)
![New project modal](../img/webapp_report_new_report_dark.png#dark-mode-only)

## MarkDown Formatting Quick Guide

The following is a quick reference for the MarkDown syntax that can be used in ClearML Reports.

### Heading Levels

To create headings, add `#` in front of the phrases that you want to turn into
headings. The number of `#` signs correspond to the heading level (i.e. `#` for level-1 heading, `##` for level-2, etc.): 

| MarkDown | Rendered Output                                                                                                                     |
|---|-------------------------------------------------------------------------------------------------------------------------------------|
| <code># H1</code><br/><code>## H2</code><br/><code>### H3</code><br/><code>#### H4</code><br/><code>##### H5</code><br/><code>###### H6</code>| ![Report headings](../img/reports_headings.png#light-mode-only) ![Report headings](../img/reports_headings_dark.png#dark-mode-only) |

### Text Emphasis

The following table presents the text format options: 

|Format Option| MarkDown | Rendered Output |
|---|---|---|
|Bold | \*\*This is bold text\*\* and \_\_so is this\_\_ |**This is bold text** and __so is this__|
|Italics | \*This is italic text\* and \_so is this\_|*This is italic text* and _so is this_|
|Strikethrough |\~\~Strikethrough\~\~ |~~Strikethrough~~|
|Inline Code | \`this is code\`| `this is code` |

### Blockquotes

To create a blockquote, add a `>` before each line of the quote. Nest blockquotes by adding additional 
`>` signs before each line of the nested blockquote.  

| MarkDown | Rendered Output                                                                                                                                 |
|---|-------------------------------------------------------------------------------------------------------------------------------------------------|
| <code>\> Blockquote<br/>\>\> Nested quote 1<br/>\>\>\> Nested quote 2</code>| ![Report Blockquotes](../img/reports_blockquotes.png#light-mode-only) ![Report Blockquotes](../img/reports_blockquotes_dark.png#dark-mode-only) |

### Lists

#### Ordered List

Create an ordered list by numbering the list items with numbers followed by periods. The list items do not have to be numbered 
correctly, but the list will be rendered numerically starting with `1.`.

| MarkDown | Rendered Output                                                                                                                                     |
|---|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| <code>1. Item 1<br/>2. Item 2<br/>1. Item 3<br/>1. Item 4</code>| ![Report ordered list](../img/reports_ordered_list.png#light-mode-only) ![Report ordered list](../img/reports_ordered_list_dark.png#dark-mode-only) |

#### Unordered List

Create an unordered list by starting each line with the `+`, `-`, or `*` signs. Different 
signs can be used to create the bullets in the same list, but they are all rendered uniformly.

You can also use checkmarks (`* [x]`), following any of the bullet signs. 

To nest lists, indent nested items 2 spaces more than their parent list item.

| MarkDown | Rendered Output                                                                                                                                             |
|---|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <code>+ Item 1<br/>+ Item 2<br/>&nbsp;&nbsp;- Sub-item a:<br/>&nbsp;&nbsp;&nbsp;&nbsp;\* Sub-sub-item x<br/>&nbsp;&nbsp;&nbsp;&nbsp;+ Sub-sub-item y<br/>&nbsp;&nbsp;&nbsp;&nbsp;- Sub-sub-item z<br/>\* [x] A checkmark </code>| ![Report unordered list](../img/reports_unordered_list.png#light-mode-only) ![Report unordered list](../img/reports_unordered_list_dark.png#dark-mode-only) |


### Tables

MarkDown code for a table looks like this:

```markdown
|          | Align Right | Align Left | Align Center |
| -------- | -----------:|:---------- |:------------:|
| 1        |           1 | 1          |      1       |
| 11       |          11 | 11         |      11      |
```

The rendered output should look like this:

![Report table](../img/reports_table.png#light-mode-only)
![Report table](../img/reports_table_dark.png#dark-mode-only)

Add the table column names in the first row; each name is preceded and followed by a pipe (`|`).
In the second row, add sets of at least three hyphens (`---`) for each column, and add a pipe before and after each set 
of hyphens. In the second row, you can specify each table column's contents alignment. To align the contents to the 
left, place a colon (`:`) to the left of the hyphens. To align right, place a colon to the right of the hyphens. To 
center align, place colons on both sides of the hyphens. 

### Code

To render inline code, surround the code with single backticks (<code>\`</code>). For example \`code\` will be rendered `code`. 

To create block code, use one of the following options:
* Indent the code  
    ```
        from clearml import Task

        t = Task.init(project_name='My project', task_name='Base')
    ```

* Surround code with "fences"--three backticks (<code>```</code>):
   

   ~~~
   ```  
   from clearml import Task

   t = Task.init(project_name='My project', task_name='Base')  
   ```
   ~~~

  
Both of these options will be rendered as:

```
from clearml import Task

t = Task.init(project_name='My project', task_name='Base')
```

#### Syntax Highlighting 

To display syntax highlighting, specify the coding language after the first fence (e.g. <code>\```python</code>, <code>\```json</code>, <code>\```js</code>, etc.):

~~~
```python
from clearml import Task

t = Task.init(project_name='My project', task_name='Base')
```
~~~

The rendered output should look like this:

```py
from clearml import Task

t = Task.init(project_name='My project', task_name='Base')
```


### Links

To create a link, enclose link text inside brackets, followed by the URL link enclosed in parentheses:

```
[link text](https://clear.ml)
```

The rendered output should look like this:
[link text](https://clear.ml)

To add a title to the link, which you can see in a tooltip when hovering over the link, add the title after the URL
link in the parentheses: 

```
[link with title](https://clear.ml "ClearML Documentation")
```

The rendered output should look like this: [link with title](https://clear.ml "ClearML Documentation"). Hover over the 
link to see the link's title.

### Collapsible Sections

The MarkDown code for a collapsible panel looks like this:

```
<details><summary>Section title</summary>Collapsible Section Contents</details>
```

The collapsible panel is surrounded by `<details>` tags. Within the `<details>` tag, add the section's title between
the `<summary>` tags. This title can be seen when the panel is collapsed. After the `</summary>` tag, add the panel
contents. 

It is rendered like this:

<details><summary>Section title</summary>Collapsible Section Contents</details>




### Horizontal Rules

Create horizontal lines using three hyphens (`---`), underscores (`___`), or asterisks (`***`): 

| MarkDown | Rendered Output                                                                                                                                                       |
|---|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <code>---<br/><br/>___<br/><br/>***</code>| ![Reports horizontal rules](../img/reports_horizontal_rules.png#light-mode-only) ![Reports horizontal rules](../img/reports_horizontal_rules_dark.png#dark-mode-only) |


### Images

To add an image, add an exclamation point, followed by the alt text enclosed by brackets, followed by the link to the 
image enclosed in parentheses: 

```
![Logo](https://raw.githubusercontent.com/clearml/clearml/master/docs/clearml-logo.svg)
```

The rendered output should look like this:

![Logo](https://raw.githubusercontent.com/clearml/clearml/master/docs/clearml-logo.svg)

To add a title to the image, which you can see in a tooltip when hovering over the image, add the title after the image's
link: 

```
![With title](https://raw.githubusercontent.com/clearml/clearml/master/docs/clearml-logo.svg "ClearML logo")
```
The rendered output should look like this:

<img src="https://raw.githubusercontent.com/clearml/clearml/master/docs/clearml-logo.svg" alt="Logo with Title" title="ClearML logo"/>

Hover over the image to see its title. 






