/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

module.exports = {
    mainSidebar: [
        {
            type: 'doc',
            id: 'overview',
            label: 'ClearML at a Glance',
        },
        {
            type: 'category',
            collapsible: true,
            label: 'Infrastructure Control Plane (GPUaaS)',
            items: [
                'fundamentals/agents_and_queues',
                'clearml_agent',
                'clearml_agent/clearml_agent_dynamic_gpus',
                'clearml_agent/clearml_agent_fractional_gpus',
                'cloud_autoscaling/autoscaling_overview',
                'remote_session'
            ]
        },
        {
            type: 'category',
            collapsible: true,
            label: 'AI Development Center',
            items: [
                'clearml_sdk/clearml_sdk',
                'pipelines/pipelines',
                'clearml_data/clearml_data',
                'hyper_datasets',
                'model_registry',
            ]
        },
        {
            type: 'category',
            collapsible: true,
            label: 'GenAI App Engine',
            items: [
                'deploying_clearml/enterprise_deploy/appgw',
                'build_interactive_models',
                'deploying_models',
                'custom_apps'
            ]
        },
    ],
    usecaseSidebar: [
        /*'getting_started/main',*/
        'getting_started/auto_log_exp',
        'getting_started/track_tasks',
        'getting_started/reproduce_tasks',
        'getting_started/logging_using_artifacts',
        'getting_started/data_management',
        'getting_started/remote_execution',
        'getting_started/building_pipelines',
        'getting_started/hpo',
        'getting_started/clearml_agent_docker_exec',
        'getting_started/clearml_agent_base_docker',
        'getting_started/clearml_agent_scheduling',
        {"Deploying Model Endpoints": [
            {
                type: 'category',
                collapsible: true,
                collapsed: true,
                label: 'ClearML Serving',
                link: {type: 'doc', id: 'clearml_serving/clearml_serving'},
                items: ['clearml_serving/clearml_serving_tutorial', 'clearml_serving/clearml_serving_extra']
            },
            {
                type: 'category',
                collapsible: true,
                collapsed: true,
                label: 'Model Launchers',
                items: [
                           'webapp/applications/apps_embed_model_deployment',
                           'webapp/applications/apps_model_deployment',
                           'webapp/applications/apps_llama_deployment'
                ]
            }
        ]},
        {"Launching a Remote IDE": [
            'apps/clearml_session',
            {type: 'ref', id: 'webapp/applications/apps_ssh_session'},
            {type: 'ref', id: 'webapp/applications/apps_jupyter_lab'},
            {type: 'ref', id: 'webapp/applications/apps_vscode'}
        ]},
        {"Building Interactive Model Demos": [
            {type: 'ref', id: 'webapp/applications/apps_gradio'},
            {type: 'ref', id: 'webapp/applications/apps_streamlit'},
            {type: 'ref', id: 'webapp/applications/apps_llm_ui'},
        ]},
        'getting_started/task_trigger_schedule',
        'getting_started/project_progress',
        {'Video Tutorials': [
            'getting_started/video_tutorials/quick_introduction',
            'getting_started/video_tutorials/core_component_overview',
            'getting_started/video_tutorials/experiment_manager_hands-on',
            'getting_started/video_tutorials/experiment_management_best_practices',
            'getting_started/video_tutorials/agent_remote_execution_and_automation',
            'getting_started/video_tutorials/hyperparameter_optimization',
            'getting_started/video_tutorials/pipelines_from_code',
            'getting_started/video_tutorials/pipelines_from_tasks',
            'getting_started/video_tutorials/clearml-data',
            'getting_started/video_tutorials/the_clearml_autoscaler',
            'getting_started/video_tutorials/hyperdatasets_data_versioning',
            {'Hands-on MLOps Tutorials': [
                'getting_started/video_tutorials/hands-on_mlops_tutorials/how_clearml_is_used_by_a_data_scientist',
                'getting_started/video_tutorials/hands-on_mlops_tutorials/how_clearml_is_used_by_an_mlops_engineer',
                'getting_started/video_tutorials/hands-on_mlops_tutorials/ml_ci_cd_using_github_actions_and_clearml'
            ]}
        ]},
    ],
    integrationsSidebar: [
            {
                type: 'doc',
                label: 'Overview',
                id: 'integrations/integrations',
            },
            'integrations/autokeras',
            'integrations/catboost',
            'integrations/click',
            'integrations/fastai',
            {"Hugging Face": ['integrations/transformers', 'integrations/accelerate']},
            'integrations/hydra', 'integrations/jsonargparse',
            'integrations/keras', 'integrations/keras_tuner',
            'integrations/langchain',
            'integrations/lightgbm', 'integrations/matplotlib',
            'integrations/megengine', 'integrations/monai', 'integrations/tao',
            {"OpenMMLab":['integrations/mmcv', 'integrations/mmengine']},
            'integrations/optuna',
            'integrations/python_fire', 'integrations/pytorch',
            'integrations/ignite',
            'integrations/pytorch_lightning',
            'integrations/scikit_learn', 'integrations/seaborn',
            'integrations/splunk',
            'integrations/tensorboard', 'integrations/tensorboardx', 'integrations/tensorflow',
            'integrations/xgboost', 'integrations/yolov5', 'integrations/yolov8'
    ],
    guidesSidebar: [
            'guides/guidemain',
            {'Advanced': ['guides/advanced/execute_remotely', 'guides/advanced/multiple_tasks_single_process']},
            {'Automation': ['guides/automation/manual_random_param_search_example', 'guides/automation/task_piping']},
            {'ClearML Task': ['guides/clearml-task/clearml_task_tutorial']},
            {'ClearML Agent': ['guides/clearml_agent/executable_exp_containers', 'guides/clearml_agent/exp_environment_containers', 'guides/clearml_agent/reproduce_exp']},
            {'Datasets': ['clearml_data/data_management_examples/data_man_cifar_classification', 'clearml_data/data_management_examples/data_man_python']},
            {id: 'hyperdatasets/code_examples', type: 'doc', label: 'Hyper-Datasets'},
            {'Distributed': ['guides/distributed/distributed_pytorch_example', 'guides/distributed/subprocess_example']},
            {'Docker': ['guides/docker/extra_docker_shell_script']},
            {'Frameworks': [
                'guides/frameworks/autokeras/autokeras_imdb_example',
                'guides/frameworks/catboost/catboost',
                'guides/frameworks/fastai/fastai_with_tensorboard',
                 {'Hugging Face': ['guides/frameworks/huggingface/transformers']},
                 {'Keras': ['guides/frameworks/keras/jupyter', 'guides/frameworks/keras/keras_tensorboard']},
                'guides/frameworks/lightgbm/lightgbm_example',
                'guides/frameworks/matplotlib/matplotlib_example',
                'guides/frameworks/megengine/megengine_mnist',
                {'PyTorch':
                        [
                            'guides/frameworks/pytorch/pytorch_distributed_example', 'guides/frameworks/pytorch/pytorch_matplotlib',
                            'guides/frameworks/pytorch/pytorch_mnist', 'guides/frameworks/pytorch/pytorch_tensorboard','guides/frameworks/pytorch/tensorboard_toy_pytorch',
                            'guides/frameworks/pytorch/pytorch_tensorboardx', 'guides/frameworks/pytorch/pytorch_abseil', 'guides/frameworks/pytorch/model_updating',
                            {'PyTorch Notebooks': [
                                {'Audio': ['guides/frameworks/pytorch/notebooks/audio/audio_classification_UrbanSound8K', 'guides/frameworks/pytorch/notebooks/audio/audio_preprocessing_example']},
                                {'Image': ['guides/frameworks/pytorch/notebooks/image/hyperparameter_search', 'guides/frameworks/pytorch/notebooks/image/image_classification_CIFAR10']},
                                {'Table': ['guides/frameworks/pytorch/notebooks/table/download_and_preprocessing', 'guides/frameworks/pytorch/notebooks/table/tabular_training_pipeline']},
                                {'Text': ['guides/frameworks/pytorch/notebooks/text/text_classification_AG_NEWS']}]
                            }
                            ]
                },
                {'PyTorch Ignite': ['guides/frameworks/pytorch_ignite/integration_pytorch_ignite', 'guides/frameworks/pytorch_ignite/pytorch_ignite_mnist']},
                'guides/frameworks/pytorch_lightning/pytorch_lightning_example',
                {'Scikit-Learn': ['guides/frameworks/scikit-learn/sklearn_joblib_example', 'guides/frameworks/scikit-learn/sklearn_matplotlib_example']},
                {'TensorBoardX': ['guides/frameworks/tensorboardx/tensorboardx', "guides/frameworks/tensorboardx/video_tensorboardx"]},
                {
                    'TensorFlow': ['guides/frameworks/tensorflow/tensorboard_pr_curve', 'guides/frameworks/tensorflow/tensorboard_toy',
                        'guides/frameworks/tensorflow/tensorflow_mnist', 'guides/frameworks/tensorflow/integration_keras_tuner']
                },
                {'XGBoost': ['guides/frameworks/xgboost/xgboost_sample', 'guides/frameworks/xgboost/xgboost_metrics']}
            ]},
            {'IDEs': ['guides/ide/remote_jupyter_tutorial', 'guides/ide/integration_pycharm', 'guides/ide/google_colab']},
            {'Offline Mode':['guides/set_offline']},
            {'Optimization': ['guides/optimization/hyper-parameter-optimization/examples_hyperparam_opt']},
            {'Pipelines': ['guides/pipeline/pipeline_controller', 'guides/pipeline/pipeline_decorator', 'guides/pipeline/pipeline_functions']},
            {'Reporting': ['guides/reporting/explicit_reporting','guides/reporting/3d_plots_reporting', 'guides/reporting/artifacts', 'guides/reporting/using_artifacts', 'guides/reporting/clearml_logging_example', 'guides/reporting/html_reporting',
                'guides/reporting/hyper_parameters', 'guides/reporting/image_reporting', 'guides/reporting/manual_matplotlib_reporting', 'guides/reporting/media_reporting',
                'guides/reporting/model_config', 'guides/reporting/pandas_reporting', 'guides/reporting/plotly_reporting',
                'guides/reporting/scalar_reporting', 'guides/reporting/scatter_hist_confusion_mat_reporting', 'guides/reporting/text_reporting']},
            {'Services': ['guides/services/aws_autoscaler', 'guides/services/cleanup_service', 'guides/services/slack_alerts']},
            {'Storage': ['guides/storage/examples_storagehelper']},
            {'Web UI': ['guides/ui/building_leader_board','guides/ui/tuning_exp']}

    ],
    knowledgeSidebar: [
        {'Fundamentals': [
            'fundamentals/projects',
            'fundamentals/task',
            'fundamentals/hyperparameters',
            'fundamentals/artifacts',
            'fundamentals/models',
            'fundamentals/logger',
        ]},
        {
            type: 'category',
            collapsible: true,
            collapsed: true,
            label: 'ClearML SDK',
            link: {type: 'doc', id: 'clearml_sdk/clearml_sdk'},
            items: [
                'clearml_sdk/task_sdk',
                'clearml_sdk/model_sdk',
                'hyperdatasets/task',
                'clearml_sdk/hpo_sdk',
                'clearml_sdk/apiclient_sdk'
            ]
        },
        {
            type: 'category',
            collapsible: true,
            collapsed: true,
            label: 'ClearML Pipelines',
            link: {type: 'doc', id: 'pipelines/pipelines'},
            items: [{
                "Building Pipelines": [
                    'pipelines/pipelines_sdk_tasks',
                    'pipelines/pipelines_sdk_function_decorators'
                ]
            }]
        },
        {
            type: 'category',
            collapsible: true,
            collapsed: true,
            label: 'ClearML Data',
            link: {type: 'doc', id: 'clearml_data/clearml_data'},
            items: [
                'clearml_data/clearml_data_cli',
                'clearml_data/clearml_data_sdk',
                {
                    type: 'category',
                    collapsible: true,
                    collapsed: true,
                    label: 'Workflows',
                    link: {type: 'doc', id: 'clearml_data/data_management_examples/workflows'},
                    items: [
                        'clearml_data/data_management_examples/data_man_simple',
                        'clearml_data/data_management_examples/data_man_folder_sync',
                        'clearml_data/data_management_examples/data_man_cifar_classification',
                        'clearml_data/data_management_examples/data_man_python'
                    ]
                },
            ]
        },
        {
            type: 'category',
            collapsible: true,
            collapsed: true,
            label: 'Hyper-Datasets',
            link: {type: 'doc', id: 'hyperdatasets/overview'},
            items: [
                'hyperdatasets/dataset',
                {
                    type: 'category',
                    collapsible: true,
                    collapsed: true,
                    label: 'Frames',
                    link: {type: 'doc', id: 'hyperdatasets/frames'},
                    items: [
                        'hyperdatasets/single_frames',
                        'hyperdatasets/frame_groups',
                        'hyperdatasets/sources',
                        'hyperdatasets/annotations',
                        'hyperdatasets/masks',
                        'hyperdatasets/previews',
                        'hyperdatasets/custom_metadata'
                    ]
                },
                'hyperdatasets/dataviews',
            ]
        },

    ],
    rnSidebar: [
        {'Server': [
            {
                'Open Source':
                        [
                           'release_notes/clearml_server/open_source/ver_2_2',
                           {
                               'Older Versions': [
                                   'release_notes/clearml_server/open_source/ver_2_1', 'release_notes/clearml_server/open_source/ver_2_0',
                                   'release_notes/clearml_server/open_source/ver_1_17', 'release_notes/clearml_server/open_source/ver_1_16',
                                   'release_notes/clearml_server/open_source/ver_1_15', 'release_notes/clearml_server/open_source/ver_1_14',
                                   'release_notes/clearml_server/open_source/ver_1_13', 'release_notes/clearml_server/open_source/ver_1_12',
                                   'release_notes/clearml_server/open_source/ver_1_11', 'release_notes/clearml_server/open_source/ver_1_10',
                                   'release_notes/clearml_server/open_source/ver_1_9', 'release_notes/clearml_server/open_source/ver_1_8',
                                   'release_notes/clearml_server/open_source/ver_1_7', 'release_notes/clearml_server/open_source/ver_1_6',
                                   'release_notes/clearml_server/open_source/ver_1_5', 'release_notes/clearml_server/open_source/ver_1_4',
                                   'release_notes/clearml_server/open_source/ver_1_3', 'release_notes/clearml_server/open_source/ver_1_2',
                                   'release_notes/clearml_server/open_source/ver_1_1', 'release_notes/clearml_server/open_source/ver_1_0',
                                   'release_notes/clearml_server/open_source/ver_0_17', 'release_notes/clearml_server/open_source/ver_0_16',
                                   'release_notes/clearml_server/open_source/ver_0_15', 'release_notes/clearml_server/open_source/ver_0_14',
                                   'release_notes/clearml_server/open_source/ver_0_13', 'release_notes/clearml_server/open_source/ver_0_12',
                                   'release_notes/clearml_server/open_source/ver_0_11', 'release_notes/clearml_server/open_source/ver_0_10',
                               ]
                           }
                        ]
            },
            {
                'Enterprise':
                        [
                           'release_notes/clearml_server/enterprise/ver_3_27',
                           {
                                'Older Versions': [
                                     'release_notes/clearml_server/enterprise/ver_3_26',
                                     'release_notes/clearml_server/enterprise/ver_3_25', 'release_notes/clearml_server/enterprise/ver_3_24',
                                     'release_notes/clearml_server/enterprise/ver_3_23', 'release_notes/clearml_server/enterprise/ver_3_22',
                                     'release_notes/clearml_server/enterprise/ver_3_21', 'release_notes/clearml_server/enterprise/ver_3_20'
                                ]
                           }
                        ]
            }
        ]},
        {'SDK': [
            {
                'Open Source':
                        [
                           'release_notes/sdk/open_source/ver_2_0',
                           {
                                'Older Versions': [
                                   'release_notes/sdk/open_source/ver_1_18', 'release_notes/sdk/open_source/ver_1_17',
                                   'release_notes/sdk/open_source/ver_1_16', 'release_notes/sdk/open_source/ver_1_15',
                                   'release_notes/sdk/open_source/ver_1_14', 'release_notes/sdk/open_source/ver_1_13',
                                   'release_notes/sdk/open_source/ver_1_12', 'release_notes/sdk/open_source/ver_1_11',
                                   'release_notes/sdk/open_source/ver_1_10', 'release_notes/sdk/open_source/ver_1_9',
                                   'release_notes/sdk/open_source/ver_1_8', 'release_notes/sdk/open_source/ver_1_7',
                                   'release_notes/sdk/open_source/ver_1_6', 'release_notes/sdk/open_source/ver_1_5',
                                   'release_notes/sdk/open_source/ver_1_4', 'release_notes/sdk/open_source/ver_1_3',
                                   'release_notes/sdk/open_source/ver_1_2', 'release_notes/sdk/open_source/ver_1_1',
                                   'release_notes/sdk/open_source/ver_1_0', 'release_notes/sdk/open_source/ver_0_17',
                                   'release_notes/sdk/open_source/ver_0_16', 'release_notes/sdk/open_source/ver_0_15',
                                   'release_notes/sdk/open_source/ver_0_14', 'release_notes/sdk/open_source/ver_0_13',
                                   'release_notes/sdk/open_source/ver_0_12', 'release_notes/sdk/open_source/ver_0_11',
                                   'release_notes/sdk/open_source/ver_0_10', 'release_notes/sdk/open_source/ver_0_9',
                                   ]
                           }
                        ]
            },
            {
                'Enterprise':
                        [
                           'release_notes/sdk/enterprise/ver_3_13',
                           {
                                'Older Versions': [
                                   'release_notes/sdk/enterprise/ver_3_12',
                                   'release_notes/sdk/enterprise/ver_3_11',
                                   'release_notes/sdk/enterprise/ver_3_10',
                                ]
                           }
                        ]
            }
        ]},
        {'ClearML Agent':
            [
                'release_notes/clearml_agent/ver_2_0',
                {
                    'Older Versions': [
                        'release_notes/clearml_agent/ver_1_9', 'release_notes/clearml_agent/ver_1_8',
                        'release_notes/clearml_agent/ver_1_7', 'release_notes/clearml_agent/ver_1_6',
                        'release_notes/clearml_agent/ver_1_5', 'release_notes/clearml_agent/ver_1_4',
                        'release_notes/clearml_agent/ver_1_3', 'release_notes/clearml_agent/ver_1_2',
                        'release_notes/clearml_agent/ver_1_1', 'release_notes/clearml_agent/ver_1_0',
                        'release_notes/clearml_agent/ver_0_17', 'release_notes/clearml_agent/ver_0_16',
                        'release_notes/clearml_agent/ver_0_15', 'release_notes/clearml_agent/ver_0_14',
                        'release_notes/clearml_agent/ver_0_13', 'release_notes/clearml_agent/ver_0_12',
                    ]
                }
            ]
        },
        {'ClearML Serving':
            [
                'release_notes/clearml_serving/ver_1_3',
                {
                    'Older Versions': [
                        'release_notes/clearml_serving/ver_1_2',
                        'release_notes/clearml_serving/ver_1_1', 'release_notes/clearml_serving/ver_1_0',
                    ]
                }
            ]
        },
        {'Applications':
            [
                {'Deploy':
                    [
                        'release_notes/apps/llm_ui', 'release_notes/apps/vllm_model_deployment',
                        'release_notes/apps/embedding_model_deployment',
                        'release_notes/apps/llama_model_deployment',
                        'release_notes/apps/sglang',
                        'release_notes/apps/containerized_app'
                    ]
                },
                {'NVAIE':
                    [
                        'release_notes/apps/nvidia_nim'
                    ]
                },
                {'AI Dev':
                    [
                        'release_notes/apps/ssh_session', 'release_notes/apps/jupyterlab',
                        'release_notes/apps/vs_code', 'release_notes/apps/vm_desktop',
                    ]
                },
                {'Databases':
                    [
                        'release_notes/apps/qdrant', 'release_notes/apps/milvus'
                    ]
                }
            ]
        },
        {'Autoscalers': ['release_notes/autoscalers/aws_autoscaler', 'release_notes/autoscalers/gcp_autoscaler']}
    ],
    referenceSidebar: [
        {'SDK': [
            'references/sdk/task',
            'references/sdk/logger',
            {'Model': ['references/sdk/model_model',
                'references/sdk/model_inputmodel', 'references/sdk/model_outputmodel',]},
            'references/sdk/storage',
            'references/sdk/dataset',
            {'Pipeline': [
                'references/sdk/automation_controller_pipelinecontroller',
                'references/sdk/automation_controller_pipelinedecorator',
                'references/sdk/automation_job_clearmljob'
                ]
            },
            'references/sdk/scheduler',
            'references/sdk/trigger',
            {'HyperParameter Optimization': [
                'references/sdk/hpo_optimization_hyperparameteroptimizer',
                'references/sdk/hpo_optimization_gridsearch',
                'references/sdk/hpo_optimization_randomsearch',
                'references/sdk/hpo_optuna_optuna_optimizeroptuna',
                'references/sdk/hpo_hpbandster_bandster_optimizerbohb',
                'references/sdk/hpo_parameters_discreteparameterrange',
                'references/sdk/hpo_parameters_uniformintegerparameterrange',
                'references/sdk/hpo_parameters_uniformparameterrange',
                'references/sdk/hpo_parameters_parameterset',
            ]},
            {'Enterprise Hyper-Datasets': [
                {'Hyper-Dataset': [
                    'references/hyperdataset/hyperdataset',
                    'references/hyperdataset/hyperdatasetversion'
                ]},
                {'DataFrame': [
                    'references/hyperdataset/singleframe',
                    'references/hyperdataset/framegroup',
                    'references/hyperdataset/annotation',
                ]},
                'references/hyperdataset/dataview',
            ]},
        ]},
        {'CLI Tools': [
            'apps/clearml_task',
            {type: 'ref', id: 'clearml_data/clearml_data_cli'},
            'apps/clearml_param_search',
            {type: 'ref', id: 'apps/clearml_session'},
            {type: 'ref', id: 'clearml_serving/clearml_serving_cli'},
            ]
        },
        {'ClearML Agent': [
            'clearml_agent/clearml_agent_ref', 'clearml_agent/clearml_agent_env_var'
        ]},
        {
            type: 'category',
            collapsible: true,
            collapsed: true,
            label: 'Client Configuration',
            link: {type: 'doc', id: 'configs/configuring_clearml'},
            items: [
                'configs/clearml_conf',
                'configs/env_vars'
            ]
        },
        {'Server API': [
            {
                'Open Source':[
                    'references/api/index',
                    'references/api/definitions',
                    'references/api/debug',
                    'references/api/events',
                    'references/api/login',
                    'references/api/models',
                    'references/api/pipelines',
                    'references/api/projects',
                    'references/api/queues',
                    'references/api/reports',
                    'references/api/serving',
                    'references/api/tasks',
                    'references/api/workers'
                ],
                'Enterprise':[
                    'references/enterprise/index',
                    'references/enterprise/definitions',
                    'references/enterprise/apps',
                    'references/enterprise/auth',
                    // 'references/enterprise/billing',  // everything is community_only
                    'references/enterprise/datasets',
                    'references/enterprise/debug',
                    'references/enterprise/events',
                    'references/enterprise/frames',
                    'references/enterprise/login',
                    'references/enterprise/models',
                    'references/enterprise/organization',
                    'references/enterprise/permissions',
                    'references/enterprise/pipelines',
                    'references/enterprise/projects',
                    'references/enterprise/queues',
                    'references/enterprise/reports',
                    'references/enterprise/resources',
                    'references/enterprise/routers',
                    'references/enterprise/server',
                    'references/enterprise/serving',
                    'references/enterprise/sso',
                    'references/enterprise/storage',
                    'references/enterprise/system',
                    'references/enterprise/tasks',
                    'references/enterprise/tenants',
                    'references/enterprise/users',
                    'references/enterprise/variables',
                    'references/enterprise/workers'
                ]
            },
        ]},
        {
            type: 'category',
            collapsible: true,
            collapsed: true,
            label: 'WebApp',
            link: {type: 'doc', id: 'webapp/webapp_overview'},
            items: [
                {
                    type: 'category',
                    collapsible: true,
                    collapsed: true,
                    label: 'ClearML Applications',
                    link: {type: 'doc', id: 'webapp/applications/apps_overview'},
                    items: [
                        {"General": [
                            'webapp/applications/apps_hpo',
                            'webapp/applications/apps_dashboard',
                            'webapp/applications/apps_task_scheduler',
                            'webapp/applications/apps_trigger_manager',
                        ]},
                        {"AI Dev": [
                            'webapp/applications/apps_ssh_session',
                            'webapp/applications/apps_jupyter_lab',
                            'webapp/applications/apps_vscode',
                            'webapp/applications/apps_vm_desktop',
                        ]},
                        {"UI Dev": [
                            'webapp/applications/apps_gradio',
                            'webapp/applications/apps_streamlit'
                        ]},
                        {"Deploy": [
                            'webapp/applications/apps_embed_model_deployment',
                            'webapp/applications/apps_model_deployment',
                            'webapp/applications/apps_llama_deployment',
                            'webapp/applications/apps_sglang',
                            'webapp/applications/apps_container_launcher',
                            'webapp/applications/apps_llm_ui',
                        ]},
                        {"NVAIE":[
                            'webapp/applications/apps_nvidia_nim',
                        ]}
                    ]
                },
                {
                    type: 'category',
                    collapsible: true,
                    collapsed: true,
                    label: 'Orchestration',
                    link: {type: 'doc', id: 'webapp/webapp_workers_queues'},
                    items: [
                        'webapp/webapp_orchestration_dash',
                        {
                            type: 'category',
                            collapsible: true,
                            collapsed: true,
                            label: 'Autoscalers',
                            items: [
                                'webapp/applications/apps_aws_autoscaler',
                                'webapp/applications/apps_gcp_autoscaler',
                            ]
                        },
                        'webapp/resource_policies'
                    ]
                },
                'webapp/webapp_model_endpoints',
                {'Datasets': [
                    'webapp/datasets/webapp_dataset_page',
                    'webapp/datasets/webapp_dataset_viewing'
                    ]
                },
                {'Hyper-Datasets': [
                    'hyperdatasets/webapp/webapp_datasets',
                    'hyperdatasets/webapp/webapp_datasets_versioning',
                    'hyperdatasets/webapp/webapp_datasets_frames',
                    'hyperdatasets/webapp/webapp_annotator'
                ]},
                {'Projects': [
                    'webapp/webapp_home',
                    'webapp/webapp_projects_page',
                    'webapp/webapp_project_overview',
                    'webapp/webapp_project_workloads',
                    {'Tasks': [
                        'webapp/webapp_exp_table',
                        'webapp/webapp_exp_track_visual',
                        'webapp/webapp_exp_reproducing',
                        'webapp/webapp_exp_tuning',
                        'webapp/webapp_exp_comparing'
                    ]},
                    {'Models': [
                        'webapp/webapp_model_table',
                        'webapp/webapp_model_viewing',
                        'webapp/webapp_model_comparing'
                    ]},
                    {'Dataviews': [
                        'hyperdatasets/webapp/webapp_dataviews',
                        'hyperdatasets/webapp/webapp_exp_track_visual',
                        'hyperdatasets/webapp/webapp_exp_modifying',
                        'hyperdatasets/webapp/webapp_exp_comparing'
                    ]},
                    'webapp/webapp_exp_sharing',
                    'webapp/webapp_reports',
                ]},
                {'Pipelines': [
                    'webapp/pipelines/webapp_pipeline_page',
                    'webapp/pipelines/webapp_pipeline_table',
                    'webapp/pipelines/webapp_pipeline_viewing'
                ]},

                {
                    type: 'category',
                    collapsible: true,
                    collapsed: true,
                    label: 'Settings',
                    link: {type: 'doc', id: 'webapp/settings/webapp_settings_overview'},
                    items: [
                        'webapp/settings/webapp_settings_profile',
                        'webapp/settings/webapp_settings_admin_vaults',
                        'webapp/settings/webapp_settings_users',
                        'webapp/settings/webapp_settings_access_rules',
                        'webapp/settings/webapp_settings_id_providers',
                        'webapp/settings/webapp_settings_resource_configs',
                        'webapp/settings/webapp_settings_app_gw',
                        'webapp/settings/webapp_settings_usage_billing',
                        'webapp/settings/webapp_settings_storage_credentials',
                        'webapp/settings/webapp_settings_ui_customization'
                    ]
                },
            ]
        },
    ],
    installationSidebar: [
        'clearml_sdk/clearml_sdk_setup',
        {
            type: 'category',
            collapsible: true,
            collapsed: true,
            label: 'ClearML Agent',
            items: [
                {
                    'Deployment': [
                        'clearml_agent/clearml_agent_deployment_bare_metal',
                        'clearml_agent/clearml_agent_deployment_k8s',
                        'clearml_agent/clearml_agent_deployment_slurm',
                    ]
                },
                'clearml_agent/clearml_agent_execution_env',
                'clearml_agent/clearml_agent_env_caching',
                'clearml_agent/clearml_agent_services_mode',
                {'Pod Template Customization': [
                        {
                            type: 'doc',
                            label: 'String Templates',
                            id: 'clearml_agent/clearml_agent_string_template'
                        },
                        {
                            type: 'doc',
                            label: 'Conditional Templates',
                            id: 'clearml_agent/clearml_agent_conditional_template'
                        },
                        {
                            type: 'doc',
                            label: 'Dynamic Templates',
                            id: 'clearml_agent/dynamic_edit_task_pod_template'
                        },
                    ]
                },
                'clearml_agent/multi_node_training',
                'clearml_agent/clearml_agent_nvcr',
                {
                    type: 'category',
                    collapsible: true,
                    label: 'Fractional GPUs',
                    items: [
                        'clearml_agent/fractional_gpus/bare_metal_dynamic_fractional_gpus',
                        {
                            type: 'doc',
                            label: 'ClearML Dynamic MIG Operator (CDMO)',
                            id: 'clearml_agent/fractional_gpus/cdmo'
                        },
                        {
                            type: 'doc',
                            id: 'clearml_agent/fractional_gpus/cfgi'
                        },
                        {
                            type: 'doc',
                            id: 'clearml_agent/fractional_gpus/cdmo_cfgi_same_cluster'
                        },
                        {
                            type: 'doc',
                            label: 'GPU Operator Basic Deployment',
                            id: 'clearml_agent/fractional_gpus/gpu_operator'
                        },
                    ],
                },
            ]
        },
        {
            type: 'doc',
            label: 'Configuring Client Storage Access',
            id: 'integrations/storage',
        },
        {
            type: 'category',
            collapsible: true,
            collapsed: true,
            label: 'Open Source Server',
            link: {type: 'doc', id: 'deploying_clearml/clearml_server'},
            items: [
                {'Deployment Options': [
                    'deploying_clearml/clearml_server_aws_ec2_ami',
                    'deploying_clearml/clearml_server_gcp',
                    'deploying_clearml/clearml_server_linux_mac',
                    'deploying_clearml/clearml_server_win',
                    'deploying_clearml/clearml_server_kubernetes_helm'
                ]},
                'deploying_clearml/clearml_server_config',
                'deploying_clearml/clearml_server_security',
                {'Server Upgrade Procedures': [
                    'deploying_clearml/upgrade_server_aws_ec2_ami',
                    'deploying_clearml/upgrade_server_gcp',
                    'deploying_clearml/upgrade_server_linux_mac',
                    'deploying_clearml/upgrade_server_win',
                    'deploying_clearml/upgrade_server_kubernetes_helm',
                    'deploying_clearml/clearml_server_es7_migration',
                    'deploying_clearml/clearml_server_mongo44_migration'
                ]},
            ]
        },
        {
            type: 'category',
            collapsible: true,
            collapsed: true,
            label: 'Enterprise Server',
            items: [
                {'Deployment Options': [
                    {
                       type: 'category',
                       collapsible: true,
                       collapsed: true,
                       label: 'Kubernetes',
                       link: {type: 'doc', id: 'deploying_clearml/enterprise_deploy/k8s'},
                       items: [
                          {
                             type: 'doc',
                             id: 'deploying_clearml/enterprise_deploy/extra_configs/custom_billing'
                          },
                          {
                             type: 'doc',
                             id: 'deploying_clearml/enterprise_deploy/extra_configs/presign_service'
                          },
                          {
                             type: 'doc',
                             id: 'deploying_clearml/enterprise_deploy/extra_configs/self_signed_certificates'
                          },
                       ]
                    },
                    'deploying_clearml/enterprise_deploy/multi_tenant_k8s',
                    'deploying_clearml/enterprise_deploy/vpc_aws',
                    'deploying_clearml/enterprise_deploy/on_prem_ubuntu',
                    'deploying_clearml/enterprise_deploy/openshift',
                    'deploying_clearml/enterprise_deploy/air_gapped_env',
                    ]
                },
                {'Maintenance and Migration': [
                    'deploying_clearml/enterprise_deploy/import_projects',
                    'deploying_clearml/enterprise_deploy/change_artifact_links',
                    'deploying_clearml/enterprise_deploy/delete_tenant',
                    ]
                },
                {'Configuration and Access Controls': [
                   'user_management/user_groups',
                   'user_management/access_rules',
                   'user_management/admin_vaults',
                   ]
                },
                'deploying_clearml/enterprise_deploy/extra_configs/customizing_ui'
            ],
        },
        {'ClearML Application Gateway': [
            'deploying_clearml/enterprise_deploy/appgw_install_compose',
            'deploying_clearml/enterprise_deploy/appgw_install_compose_hosted',
            'deploying_clearml/enterprise_deploy/appgw_install_k8s',
            ]
        },
        {'UI Applications': [
            'deploying_clearml/enterprise_deploy/app_install_ubuntu_on_prem',
            'deploying_clearml/enterprise_deploy/apps_k8s',
            'deploying_clearml/enterprise_deploy/app_install_ex_server',
            'deploying_clearml/enterprise_deploy/app_custom',
            ]
        },
        {
           type: 'category',
           collapsible: true,
           collapsed: true,
           label: 'Identity Provider Integration',
           link: {type: 'doc', id: 'user_management/identity_providers'},
           items: [
                { "OAuth":
                    [
                        'deploying_clearml/enterprise_deploy/extra_configs/sso/sso_amazon_cognito_oauth',
                        'deploying_clearml/enterprise_deploy/extra_configs/sso/sso_azure_ad_oauth',
                        'deploying_clearml/enterprise_deploy/extra_configs/sso/sso_google_oauth',
                        'deploying_clearml/enterprise_deploy/extra_configs/sso/sso_keycloak_oauth',
                        'deploying_clearml/enterprise_deploy/extra_configs/sso/sso_microsoft_ad_oauth',
                        'deploying_clearml/enterprise_deploy/extra_configs/sso/sso_ping_id_oauth',
                        'deploying_clearml/enterprise_deploy/extra_configs/sso/sso_okta_oauth',
                    ]
                },
                {"SAML":
                    [
                        'deploying_clearml/enterprise_deploy/extra_configs/sso/sso_duo_saml',
                        'deploying_clearml/enterprise_deploy/extra_configs/sso/sso_google_saml',
                        'deploying_clearml/enterprise_deploy/extra_configs/sso/sso_microsoft_ad_saml',

                    ]
                },
                'deploying_clearml/enterprise_deploy/extra_configs/sso/sso_ldap',
//              'deploying_clearml/enterprise_deploy/sso_multi_tenant_login',


           ]
        },
        {
            type: 'doc',
            label: 'ClearML Serving',
            id: 'clearml_serving/clearml_serving_setup'
        },
    ],
    bestPracticesSidebar: [
        {
            type: 'category',
            collapsible: true,
            label: 'Best Practices',
            items: [
                {
                    type: 'doc',
                    label: 'Data Scientists',
                    id: 'best_practices/data_scientist_best_practices'
                },
                {
                    type: 'doc',
                    label: 'MLOps and LLMOps',
                    id: 'best_practices/mlops_best_practices'
                },
                {
                    type: 'doc',
                    label: 'Data Management',
                    id: 'best_practices/data_best_practices'
                },
            ],
        },
    ],

};
