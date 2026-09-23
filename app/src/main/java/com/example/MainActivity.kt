package com.example

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.ViewGroup
import android.webkit.GeolocationPermissions
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.viewinterop.AndroidView
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()
    setContent {
      MyApplicationTheme {
        RoastRouteScreen()
      }
    }
  }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun RoastRouteScreen() {
  Box(
    modifier = Modifier
      .fillMaxSize()
      .background(Color(0xFF120B08))
      .systemBarsPadding()
  ) {
    AndroidView(
      factory = { context ->
        WebView(context).apply {
          layoutParams = ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
          )
          setBackgroundColor(0xFF120B08.toInt())
          settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            setGeolocationEnabled(true)
            cacheMode = WebSettings.LOAD_DEFAULT
            mediaPlaybackRequiresUserGesture = false
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
          }
          webChromeClient = object : WebChromeClient() {
            override fun onGeolocationPermissionsShowPrompt(
              origin: String,
              callback: GeolocationPermissions.Callback
            ) {
              callback.invoke(origin, true, false)
            }
          }
          webViewClient = object : WebViewClient() {
            override fun onReceivedError(
              view: WebView?,
              request: WebResourceRequest?,
              error: WebResourceError?
            ) {
              super.onReceivedError(view, request, error)
            }
          }
          loadUrl("file:///android_asset/index.html")
        }
      },
      modifier = Modifier.fillMaxSize()
    )
  }
}

