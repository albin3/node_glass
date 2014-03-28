{
  'targets':[
    {
      'target_name': 'gtpush',
      'sources': [
        './src/IGtPush.h',
        './src/igtpush.cc'
      ],
      'link_settings': {
      'libraries':[
         '-lgtpushsdk'
      ]}
    }
  ]
}
