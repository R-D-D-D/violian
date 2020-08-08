packager \
  in=src/sample.mp4,stream=video,output=dest/sample_video.mp4 \
  in=src/sample.mp4,stream=video,output=dest/sample720_video.mp4 \
  in=src/sample.mp4,stream=video,output=dest/sample480_video.mp4 \
  in=src/sample.mp4,stream=audio,output=dest/sample_audio.mp4 \
  --profile on-demand \
  --mpd_output dest/sample-manifest-full.mpd \
  --min_buffer_time 3 \
  --segment_duration 3