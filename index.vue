<template>
  <view class="container">
    <!-- 文件选择器 -->
    <view v-show="showSelete" class="selector-container">
      <button @click="selectFile">选择文件</button>
    </view>

    <!-- 文件信息与按钮区域 -->
    <view v-show="showUpload" class="file-info-container">
      <view class="file-and-buttons">
        <text class="file-name">{{ fileName }}</text>
        <view class="button-group">
          <button v-if="status === 'inited'" @click="startUpload()">上传</button>
          <button v-if="status === 'uploading'" @click="pauseUpload()">暂停</button>
          <button v-if="status === 'paused'" @click="resumeUpload()">继续</button>
          <button v-if="status === 'success'">完成</button>
        </view>
      </view>
    </view>

    <!-- 进度条 -->
    <view v-show="showUpload" class="progress-container">
      <view class="progress-bar" :style="{ width: percent + '%' }"></view>
    </view>
  </view>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { onLoad, onReady } from '@dcloudio/uni-app';
import OSS from 'ali-oss';
// #ifdef H5 || WEB
import * as webViewUni from '@/static/js/uni.webview.1.5.6.js';
// #endif

let baseUrl;
let clientId;
let token;
let fromAcount;
let toAcount;

let file;
let client;
let tokenInfo;
let objectKey;
let checkpoint;

const showSelete = ref(true);
const showUpload = ref(false);
const fileName = ref('');
//inited、uploading、paused、success
const status = ref('inited');
const percent = ref(0);

const MB = 1024 * 1024;
const GB = 1024 * MB;

async function selectFile() {
	// #ifdef H5 || WEB
	const input = document.createElement("input");
	input.type = 'file';
	input.onchange = (e) => {
		file = e.target.files[0];
		fileName.value = file.name;
		status.value = 'inited';
		showUpload.value = true;
	}
	input.click();
	// #endif
};

async function initUpload() {
	tokenInfo = await getStsToken(file.name, 'default_custom');
	objectKey = tokenInfo.objectKey;
	client = new OSS({
		authorizationV4: true,
		region: tokenInfo.region,
		endpoint: tokenInfo.endpoint,
		accessKeyId: tokenInfo.accessKeyId,
		accessKeySecret: tokenInfo.accessKeySecret,
		stsToken: tokenInfo.stsToken,
		bucket: tokenInfo.bucket,
		retryMax: 5,
		refreshSTSToken: async () => {
			const newTokenInfo = await refreshStsToken(objectKey);
			return {
				accessKeyId: newTokenInfo.accessKeyId,
				accessKeySecret: newTokenInfo.accessKeySecret,
				stsToken: newTokenInfo.stsToken
			}
		},
		refreshSTSTokenInterval: 10 * 60 * 1000//10分钟刷新一次,单位毫秒
	});;
};

async function startUpload() {
	if (file.size >= 5 * GB) {
		alert("文件大小不能超过5G");
		return;
	}
	showSelete.value = false;
	try {
		await initUpload(file.value);
		const uploadTask = client.multipartUpload(objectKey, file, {
			partSize: 1 * MB,// 每个分片的大小
			parallel: 5,// 并发上传的分片数
			headers: {
				// 指定该Object被下载时的网页缓存行为。
				"Cache-Control": "no-cache",
				// 指定该Object被下载时的名称。
				"Content-Disposition": file.name,
				// 指定Object的存储类型。
				//"x-oss-storage-class": "Standard",
				// 指定Object标签，可同时设置多个标签。
				//"x-oss-tagging": "Tag1=1&Tag2=2",
				// 指定初始化分片上传时是否禁止覆盖同名Object。此处设置为true，表示禁止覆盖同名Object。
				"x-oss-forbid-overwrite": "true"
			},
			progress: async (p, cpt) => {
				percent.value = p * 100;
				checkpoint = cpt;
				console.log(`percent: ${Number((p * 100).toFixed(2))}%`);
			},
			success: (result) => {
				console.log(`success:`,result );
			},
			error: (err) => {
				console.error(`error:`, err);
			}
		});
		status.value = 'uploading';
		const result = await uploadTask;
		console.log(`multiPartUpload result:`, result);
		const ossInfo = await finishUpload(objectKey);
		console.log(`multiPartUpload success ossInfo:`, ossInfo);
		status.value = 'success';
		postMessage(file, ossInfo.data);
		return ossInfo;
	} catch (error) {
		console.error(`multiPartUpload error:`, error);
	}
};

async function pauseUpload() {
	try {
		await client.cancel();
		status.value = 'paused';
		console.log(`pauseMultipartUpload success`);
	} catch (error) {
		console.error(`pauseMultipartUpload error:`, error);
	}
};

async function resumeUpload() {
	try {
		const uploadTask = client.multipartUpload(objectKey, checkpoint.file, {
			partSize: 1 * MB,// 每个分片的大小
			parallel: 5,// 并发上传的分片数
			checkpoint: checkpoint,
			headers: {
				"Cache-Control": "no-cache",
				"Content-Disposition": checkpoint.file.name,
				"x-oss-forbid-overwrite": "true"
			},
			progress: async (p, cpt) => {
				percent.value = p * 100;
				checkpoint = cpt;
				console.log(`percent: ${Number((p * 100).toFixed(2))}%`);
			},
			success: (result) => {
				console.log(`success: ${result}`);
			},
			error: (err) => {
				console.error(`error: ${err.message}`);
			}
		});
		status.value = 'uploading';
		const result = await uploadTask;
		console.log(`resumeMultipartUpload result:`, result);
		const ossInfo = await finishUpload(objectKey);
		console.log(`resumeMultipartUpload success ossInfo:`, ossInfo);
		status.value = 'success';
		postMessage(file, ossInfo.data);
		return ossInfo;
	} catch (error) {
		console.error(`resumeMultipartUpload error:`, error);
	}
};

async function abortUpload() {
	try {
		client.abortMultipartUpload(objectKey, checkpoint.uploadId).then(result => {
			console.log(`abortMultipartUpload success result:`, result);
		});
	} catch (error) {
		console.error(`abortMultipartUpload error:`, error);
	}
};

async function getStsToken(fileName, configKey) {
	const url = `${baseUrl}/oss/sts/token?fileName=${fileName}&configKey=${configKey}`;
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'clientid': clientId,
			'authorization': `Bearer ${token}`
		}
	});
	const res = await response.json();
	return res.data;
};

async function refreshStsToken(objectKey) {
	const url = `${baseUrl}/oss/sts/refresh?objectKey=${objectKey}`;
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'clientid': clientId,
			'authorization': `Bearer ${token}`
		}
	});
	const res = await response.json();
	return res.data;
};

async function simpleUpload(file) {
	return new Promise(async (resolve, reject) => {
		const response = await presignPut(file);
		const objectKey = response.data.key;
		const signedUrl = response.data.url;
		const signedHeaders = response.data.signedHeaders;
		var xhr = new XMLHttpRequest();
		xhr.open('PUT', signedUrl, true);
		if (signedHeaders) {
			for (let key in signedHeaders) {
				xhr.setRequestHeader(key, signedHeaders[key]);
			}
		}
		xhr.onload = (e) => {
			if (xhr.readyState === 4 && xhr.status === 200) {
				finishUpload(objectKey).then(res => resolve(res))
			} else {
				reject(xhr.responseText)
			}
		};
		xhr.upload.onprogress = (e) => {
			if (e.lengthComputable) {
				progress.value = (e.loaded / e.total) * 100;
				progressPercent.value = progress.value.toFixed(2);
				console.log(`${progressPercent.value}%`);
			}
		};
		xhr.send(file);
	});
};

async function presignPut(file, configKey) {
	const url = `${baseUrl}/oss/presign/put?fileName=${file.name}&configKey=${configKey}`;
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'clientid': clientId,
			'authorization': `Bearer ${token}`
		}
	});

	return response.json();
};

async function finishUpload(objectKey) {
	const url = `${baseUrl}/oss/upload/finish?key=${objectKey}`;
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'clientid': clientId,
			'authorization': `Bearer ${token}`
		}
	});
	//格式为 {"code":200,"msg":"操作成功","data":{"ossId":"","fileName":"","url":""}}
	return response.json();
};

async function postMessage(file, ossData) {
	uni.webView.postMessage({
		data: {
			name: file.name,
			size: file.size,
			type: file.type,
			url: ossData.url,
			ossId: ossData.ossId
		}
	});
};

onLoad((options) => {
	console.log('onLoad');
	clientId = options.clientId;
	token = options.token;
	fromAcount = options.fromAcount;
	toAcount = options.toAcount;
	baseUrl = options.baseUrl;
});

onReady(() => {
	console.log('onReady');
});

onMounted(async () => {
	console.log('onMounted');
});

onUnmounted(async () => {
	console.log('onUnmounted');
});
</script>

<style>
/* 容器基础样式 */
.container {
  padding: 20rpx;
}

/* 文件信息容器 */
.file-info-container {
  margin: 20rpx 0;
}

/* 文件名和按钮组容器 */
.file-and-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
}

/* 文件名样式 */
.file-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 28rpx;
  color: #333;
  margin-right: 20rpx;
}

/* 按钮组容器 */
.button-group {
  display: flex;
  gap: 20rpx;
}

/* 按钮基础样式 */
.button-group button {
  padding: 0 20rpx;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 24rpx;
  border-radius: 6rpx;
  flex: 1;
  max-width: 140rpx;
  white-space: nowrap;
}

/* 进度条容器 */
.progress-container {
  height: 6rpx;
  background-color: #f0f0f0;
  border-radius: 3rpx;
  overflow: hidden;
  margin: 20rpx 0;
}

/* 进度条填充 */
.progress-bar {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s ease;
}


</style>
