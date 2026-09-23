---
title: Masks
---

:::important[Enterprise Feature]
Hyper-Datasets are available under the ClearML Enterprise plan.
:::

Masks are source data used in deep learning for image segmentation. A mask is a property of `DataSubEntryImage`.

ClearML applies masks in one of two modes:
* **Pixel segmentation** - Pixel RGB values are each mapped to a label.
* **Alpha channel** - Pixel RGB values are interpreted as opacity values.

In the WebApp's [frame viewer](../webapp/webapp_datasets_frames.md#masks), you can select how to apply a
mask over a sub-entry.

## Pixel Segmentation

For pixel segmentation, mask RGB pixel values are each mapped to a label via the annotation's `mask_rgb` value.

* Original sub-entry image:

  ![Frame without mask](../../img/hyperdatasets/dataset_pixel_masks_1.png#light-mode-only)
  ![Frame without mask](../../img/hyperdatasets/dataset_pixel_masks_1_dark.png#dark-mode-only)

* Same sub-entry with the semantic segmentation mask enabled, labels applied according to each ROI's `mask_rgb`
  value:

  ![Frame with semantic seg mask](../../img/hyperdatasets/dataset_pixel_masks_2.png#light-mode-only)
  ![Frame with semantic seg mask](../../img/hyperdatasets/dataset_pixel_masks_2_dark.png#dark-mode-only)

## Alpha Channel

For alpha channel masks, RGB pixel values are interpreted as opacity values so that when the mask is applied, only
the desired sections of the source are visible, and no labels are used.

* Original sub-entry:

  ![Maskless frame](../../img/hyperdatasets/dataset_alpha_masks_1.png#light-mode-only)
  ![Maskless frame](../../img/hyperdatasets/dataset_alpha_masks_1_dark.png#dark-mode-only)

* Same sub-entry with an alpha channel mask applied, emphasizing the troll doll:

  ![Alpha mask frame](../../img/hyperdatasets/dataset_alpha_masks_2.png#light-mode-only)
  ![Alpha mask frame](../../img/hyperdatasets/dataset_alpha_masks_2_dark.png#dark-mode-only)

## Usage

### Registering a Sub-Entry with a Mask

Set a sub-entry's mask source with [`DataSubEntryImage.set_mask_source()`](../../references/sdk/hpd_datasubentryimage.md#set_mask_source):

```python
from clearml import DataSubEntryImage

sub_entry = DataSubEntryImage(
    source='https://s3.amazonaws.com/allegro-datasets/cityscapes/leftImg8bit_trainvaltest/leftImg8bit/val/frankfurt/frankfurt_000000_000294_leftImg8bit.png',
)
sub_entry.set_mask_source(
    'https://s3.amazonaws.com/allegro-datasets/cityscapes/gtFine_trainvaltest/gtFine/val/frankfurt/frankfurt_000000_000294_gtFine_labelIds.png'
)
```

`set_mask_source()` returns the mask's assigned ID (auto-numbered, starting from `"00"`), which you can use later
with `get_mask_source()` or `get_local_mask_source()` if the sub-entry ends up with more than one mask.

For pixel segmentation, tie a mask's RGB value to a label on the annotation that uses it, via the `mask_rgb`
argument of [`add_annotation()`](annotations.md#sub-entry-annotations):

```python
sub_entry.add_annotation(mask_rgb=(1, 1, 1), labels=['person', 'sitting'])
```

### Registering a Sub-Entry with Multiple Masks

A sub-entry can contain multiple masks (for example, semantic and instance segmentation of the same source). Use
[`DataSubEntryImage.set_masks_source()`](../../references/sdk/hpd_datasubentryimage.md#set_masks_source), passing a
list of mask URIs. Numeric IDs are automatically assigned ("00", "01", etc.):

```python
sub_entry.set_masks_source(['<mask_URI_1>', '<mask_URI_2>'])
```

To assign your own mask IDs, pass a dictionary of mask ID keys and mask URI values to the `masks_source` argument
when constructing the sub-entry:

```python
sub_entry = DataSubEntryImage(
    source='<image_URI>',
    masks_source={'seg': '<mask_URI_1>', 'instance_seg': '<mask_URI_2>'},
)
```

Read all mask sources back with `get_masks_source_dict()`, or a single mask's source with
`get_mask_source(mask_id=...)`. `mask_id` is optional; if omitted, the first mask is returned.
