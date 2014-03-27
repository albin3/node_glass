{
  'targets':[
    {
      'target_name': 'gtpush',
      'sources': [
        './src/IGtPush.h',
        './src/hello.cc'
      ],
      'link_settings': {
      'libraries':[
         '-lgtpushsdk'
      ]}
    }
  ]
}
