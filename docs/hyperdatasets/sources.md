---
title: Sources
---

Each frame contains `sources`, a list of dictionaries containing: 
* Attributes of the source data (image raw data)
* A `URI` pointing to the source data (image or video)
* Sources for [masks](masks.md) used in semantic segmentation
* Image [previews](previews.md), which are thumbnails used in the ClearML Enterprise WebApp (UI).
 
`sources` does not contain ROI metadata, because ROIs can be used over multiple frames. Instead, frames contain a 
top-level `rois` array, which is a list of ROI dictionaries, where each dictionary contains a 
list of source IDs. Those IDs connect `sources` to ROIs.

## Examples 

The examples below demonstrate the `sources` section of a Frame for different types of content.

### Example 1: Video Sources

This example demonstrates `sources` for video.

<Details class="panel info">
<summary class="panel-title">Example 1</summary>

```json
/* video from one of four cameras on car */
"sources": [
    {
        "id": "front",
        "content_type": "video/mp4",
        "width": 800,
        "height": 600,
        "uri": "https://s3.amazonaws.com/my_cars/car_1/front.mp4",
        "timestamp": 1234567889,
        "meta" :{
            "angle":45,
            "fov":129
        },
    },
    {
        "id": "rear",
        "uri": "https://s3.amazonaws.com/my_cars/car_1/rear.mp4",
        "content_type": "video/mp4",
        "timestamp": 1234567889
    }
    
```

</Details>

The `sources` example above details a video from a car that has two cameras. One camera
is the source with the ID `front` and the other is the source with the ID `rear`.

`sources` includes the following information about the Frame:
* `content_type` - The video is an `mp4` file
* `width` and `height` - Each frame in the video is `800` pixels by `600` pixels,
* `uri` - The raw data is located in `s3.amazonaws.com/my_cars/car_1/front.mp4` and `s3.amazonaws.com/my_cars/car_1/rear.mp4` 
  (the front and rear camera, respectively) 
* `timestamp` - This indicates the absolute position of the frame in the video
* `meta` - Additional metadata is included for the angle of the camera (`angle`) and its field of vision (`fov`).

:::note
Sources includes a variety of content types. This example shows an mp4 video.
:::

### Example 2: Images Sources

This example demonstrates `sources` images.

<Details class="panel info">
<summary class="panel-title">Example 2</summary>        

```json
/* camera images */
"sources": [
    {
        "id": "default",
        "content_type": "png",
        "width": 800,
        "height": 600,
        "uri": "https://s3.amazonaws.com/my_images/imag1000.png",
        "timestamp": 0,
    }
```

</Details>

The `sources` of this frame contains the following information:
* `content_type` - This frame contains an image in `png` format. 
* `width` and `height` - It is `800` px by `600` px, 
* `uri` - The raw data is located in `https://s3.amazonaws.com/my_images/imag1000.png`
* `timestamp` is 0 (timestamps are used for video).


### Example 3: Sources and Regions of Interest

This example demonstrates `sources` for video, `masks`, and `preview`. 

<Details class="panel info">
<summary class="panel-title">Example 3</summary>

```json

{
  "timestamp": 1234567889, 
  "context_id": "car_1", 
  "meta": {
    "velocity": "60"
  }, 
  "sources": [
    {
      "id": "front",
      "content_type": "video/mp4",
      "width": 800,
      "height": 600,
      "uri": "https://s3.amazonaws.com/my_cars/car_1/front.mp4",
      "timestamp": 1234567889,
      "meta" :{
        "angle":45,
        "fov":129
      }, 
      "preview": {
        "content_type": "image/jpg",
        "uri": "https://s3.amazonaws.com/my_previews/car_1/front_preview.jpg",
        "timestamp": 0
      },
      "masks": [
        {
          "id": "seg",
          "content_type": "video/mp4",
          "uri": "https://s3.amazonaws.com/seg_masks/car_1/front_seg.mp4",
          "timestamp": 1234567889
        },
        {
          "id": "instances_seg",
          "content_type": "video/mp4",
          "uri": "https://s3.amazonaws.com/seg_masks/car_1/front_instance_seg.mp4",
          "timestamp": 1234567889
        }
      ]
    },
    {
      "id": "rear",
      "uri": "https://s3.amazonaws.com/my_cars/car_1/rear.mp4",
      "content_type": "video/mp4",
      "timestamp": 1234567889
    }
  ],
  "rois": [
    {
      "sources":["front"],
      "label": ["right_lane"],
      "mask": {
        "id": "seg",
        "value": [-1, 1, 255]
      }
    },
    {
      "sources": ["front"],
      "label": ["bike"],
      "poly":[30, 50, 50,50, 100,50, 100,100],
      "meta": {
        "velocity": 5.4
      }
    },
    {
      "sources": ["front", "rear"],
      "label": ["car"],
      "poly":[30, 50, 50,50, 100,50, 100,100]
    }
  ]
}
```

</Details>

This frame shows the `masks` section in `sources`, and the top-level `rois` array.

In `sources`, the `masks` subsection contains the sources for the two masks associated with the raw data. 

The raw mask data is located in:

* `https://s3.amazonaws.com/my_cars/car_1/front.mp4`
* `https://s3.amazonaws.com/my_previews/car_1/front_preview.jpg`

In `rois`, the `mask` section is associated with its `masks` source using the `id` key. 
In this example: 
* In the `rois` array, there is a region of interest that has a `mask` with the ID `seg` and an RGB
  value
* The `masks` section in `sources` contains the location of each mask. The first dictionary of `masks`
details the mask with the ID `seg`. The ID connects it to the `seg` mask in `rois`

`sources` also contains the source of a preview. It is located in: `https://s3.amazonaws.com/my_previews/car_1/front_preview.jpg`.


