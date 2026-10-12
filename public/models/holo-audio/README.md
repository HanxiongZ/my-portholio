# Holo Audio — Blender V4

Source: `blender/reference_scene/communication_dome_v4.blend`.

`communication-dome-v4.glb` contains the actual meshes and PBR materials of the eleven assemblies, including applied bevel/subdivision modifiers and converted curve geometry. No external textures or remote model services are required. `preview.png` is the source Blender render, shown while the interactive model loads.

The webpage uses the source orthographic camera composition. The music note, telephone, and wireless microphone are reparented into independent source groups; their centers drive dragging, sliders, and Web Audio panners. Other assemblies retain their authored transforms. Blender's unsupported procedural dome/floor material graphs are restored with web shaders on the exported meshes.

Re-export without overwriting the `.blend` file:

```sh
"/path/to/Blender" -b blender/reference_scene/communication_dome_v4.blend --python blender/export_holo_web.py
```
