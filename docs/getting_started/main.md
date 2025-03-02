# What is ClearML?

ClearML is an open-source, end-to-end AI Platform designed to streamline AI adoption and the entire development lifecycle. 
It supports every phase of AI development, from research to production, allowing users to 
leverage any model, dataset, or architecture at scale. ClearML integrates seamlessly with existing tools, 
frameworks, and infrastructures, offering unmatched flexibility and control for AI builders and DevOps teams building, 
training, and deploying models at every scale on any AI infrastructure.


## Getting Started

<div class="vid">
<iframe style={{position: 'absolute', top: '0', left: '0', bottom: '0', right: '0', width: '100%', height: '100%'}} 
        src="https://www.youtube.com/embed/s3k9ntmQmD4" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
        allowfullscreen>
</iframe>
</div>

<br/>
    



###  Friendly Tutorials to Get You Started

<div className="tbl-1">

<table>
<tbody>
  <tr>
    <td><a href="https://github.com/clearml/clearml/blob/master/docs/tutorials/Getting_Started_1_Experiment_Management.ipynb"><b>Step 1</b></a> - Experiment Management</td>
    <td className="align-center"><a className="no-ext-icon" target="_blank" href="https://colab.research.google.com/github/clearml/clearml/blob/master/docs/tutorials/Getting_Started_1_Experiment_Management.ipynb">
  <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/>
</a></td>
  </tr>
  <tr>
    <td><a href="https://github.com/clearml/clearml/blob/master/docs/tutorials/Getting_Started_2_Setting_Up_Agent.ipynb"><b>Step 2</b></a> - Remote Execution Agent Setup</td>
    <td className="align-center"><a className="no-ext-icon" target="_blank" href="https://colab.research.google.com/github/clearml/clearml/blob/master/docs/tutorials/Getting_Started_2_Setting_Up_Agent.ipynb">
  <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/>
</a></td>
  </tr>
  <tr>
    <td><a href="https://github.com/clearml/clearml/blob/master/docs/tutorials/Getting_Started_3_Remote_Execution.ipynb"><b>Step 3</b></a> - Remotely Execute Tasks</td>
    <td className="align-center"><a className="no-ext-icon" target="_blank" href="https://colab.research.google.com/github/clearml/clearml/blob/master/docs/tutorials/Getting_Started_3_Remote_Execution.ipynb">
  <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/>
</a></td>
  </tr>
</tbody>
</table>

</div>


### Read a Little More

<div class="max-w-75 align-center">

![Architecture diagram](../img/clearml_architecture.png)

</div>

Want a more in depth introduction to ClearML? Choose where you want to get started: 


<div class="cml-card">
    <ol>
        <li>
            <i>
                <img src="/docs/latest/icons/ico-data-scientist.svg" alt="Data scientist logo" />
            </i>
            <h4>Data Scientists</h4>
            <p>Learn how to use ClearML's experiment tracking and management tools, and more!</p>
            <span class="btn-link">
                <a href="getting_started/ds/ds_first_steps">START HERE</a>
            </span>
        </li>
        <li>
            <i>
                <img src="/docs/latest/icons/ico-mlops-engineer.svg" alt="MLOps engineer logo" />
            </i>
            <h4>MLOps and LLMOps Engineers</h4>
            <p>Learn how to use ClearML's automation, orchestration, and tracking tools</p>
            <span class="btn-link">
                <a href="getting_started/mlops/mlops_first_steps">START HERE</a>
            </span>
        </li>
        <li>
            <i>
                <img src="/docs/latest/icons/ico-devops-engineer.svg" alt="DevOps Engineer logo" />
            </i>
            <h4>DevOps Engineers</h4>
            <p>Learn how to deploy and configure a ClearML Server</p>
            <span class="btn-link">
                <a href="./deploying_clearml/clearml_server#deployment">START HERE</a>
            </span>
        </li>
    </ol>
</div>


## What Can You Do with ClearML?

- [Track and upload](../fundamentals/task.md) metrics and models with only 2 lines of code
- [Reproduce](../webapp/webapp_exp_reproducing.md) tasks with 3 mouse clicks
- [Create bots](../guides/services/slack_alerts.md) that send you Slack messages based on task behavior (for example,
alert you whenever your model improves in accuracy)
- Manage your [data](../clearml_data/clearml_data.md) - store, track, and version control 
- Remotely execute tasks on any compute resource you have available with [ClearML Agent](../clearml_agent.md)  
- Automatically scale cloud instances according to your resource needs with ClearML's 
[AWS Autoscaler](../webapp/applications/apps_aws_autoscaler.md) and [GCP Autoscaler](../webapp/applications/apps_gcp_autoscaler.md)
GUI applications
- Run [hyperparameter optimization](hpo.md) 
- Build [pipelines](../pipelines/pipelines.md) from code 
- Much more!

![Webapp gif](../img/gif/webapp_screenshots.gif#light-mode-only)
![Webapp gif](../img/gif/webapp_screenshots_dark.gif#dark-mode-only)

## Who We Are
ClearML is supported by you :heart: and the [clear.ml](https://clear.ml) team, which helps enterprise companies build scalable MLOps/LLMOps.

Join the ClearML community! Your contributions, questions, and input are always welcome. For more information, see [Community Resources](../community.md).  
